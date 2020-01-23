import React from 'react'

const trackStack = []
const watchStack = []
const targetMap = new WeakMap()
const toProxy = new WeakMap()
const toRaw = new WeakMap()
const isObj = (x: any): x is object => typeof x === 'object'
const isFn = (x: any): x is Function => typeof x === 'function'
const hasOwnProperty = Object.prototype.hasOwnProperty
const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

const Types = {
  SET: 'set',
  ADD: 'add',
  DELETE: 'delete',
  ITERATE: 'iterate'
}

const ITERATE_KEY = Symbol('iterate')

export function setup(component) {
  let vdom = null
  return React.memo(props => {
    if (!vdom) vdom = component(props)
    const update = useForceUpdate()
    trackStack.push(() => update())
    let res = vdom(props)
    trackStack.pop()
    return res
  })
}

export function ref(value) {
  const target = {
    value,
    isRef: true
  }
  return reactive(target)
}

export function watch(src, cb?) {
  if (isFn(src)) {
    watchStack.push(() => src())
  }
}

export function computed(getter) {
  const ref = {
    value: null
  }
  watch(() => {
    ref.value = getter()
  })
  return ref
}

export function isRef(target) {
  return !!target.isRef
}

export function reactive(target) {
  if (!isObj(target)) return target

  let proxy = toProxy.get(target)
  if (proxy) return proxy

  if (toRaw.has(target)) return target

  const handlers = {
    get(target, key, receiver) {
      let newValue = target[key]

      if (isObj(newValue)) {
        return reactive(newValue)
      }
      let res = Reflect.get(target, key, receiver)
      track(target, key)
      return res
    },
    set(target, key, value, receiver) {
      let hadKey = hasOwn(target, key)
      let res = Reflect.set(target, key, value, receiver)
      let type = hadKey ? Types.SET : Types.ADD
      if (key in target) trigger(target, key, type)
      return res
    },
    has(target, key) {
      let res = Reflect.has(target, key)
      track(target, key)
      return res
    },
    deleteProperty(target, key) {
      let hadKey = Reflect.has(target, key) 
      let res =  Reflect.deleteProperty(target, key)
      if (hadKey) trigger(target, key, Types.DELETE)
      return res
    },
    ownKeys(target) {
      let res = Reflect.ownKeys(target)
      track(target, undefined, Types.ITERATE)
      return res
    }
  }

  let observed = new Proxy(target, handlers as any)

  toProxy.set(target, observed)
  toRaw.set(observed, target)

  if (!targetMap.has(target)) {
    targetMap.set(target, new Map())
  }

  return observed
}

function track(target, key, type?) {
  const effect = trackStack[trackStack.length - 1]
  if (effect) {
    if (type === Types.ITERATE) {
      key = ITERATE_KEY
    }
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = new Set()))
    }
    if (!dep.has(effect)) {
      dep.add(effect)
    }
  }
}

function trigger(target, key, type?) {
  let deps = targetMap.get(target)
  const effects = new Set()
  deps.get(key)?.forEach(e => effects.add(e))
  if (type === Types.ADD || type === Types.DELETE) {
    const iterationKey = Array.isArray(target) ? 'length' : ITERATE_KEY
    deps.get(iterationKey)?.forEach(e => effects.add(e))
  }
  effects.forEach((e: any) => e())
  watchStack.forEach(w => w())
}

function useForceUpdate() {
  const [, setTick] = React.useState(0)
  return React.useCallback(() => setTick(tick => tick + 1), [])
}
