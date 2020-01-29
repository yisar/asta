import * as React from 'react'

const trackStack = []
const watchStack = []
const targetMap = new WeakMap()
const toProxy = new WeakMap()
const toRaw = new WeakMap()
const isObj = (x: any): x is object => typeof x === 'object'
const isFn = (x: any): x is Function => typeof x === 'function'

export function setup(component) {
  let vdom = null
  return React.memo(props => {
    if (!vdom) vdom = component(props)
    const update = useForceUpdate()
    trackStack.push(() => update())
    return vdom(props)
  })
}

export function ref(value) {
  const target = {
    value,
    isRef: true
  }
  return reactive(target)
}

export function watch(src, cb) {
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
  }, null)
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
      let res = Reflect.set(target, key, value, receiver)
      if (key in target) trigger(target, key)
      return res
    },
    deleteProperty(target, key, receiver) {
      return Reflect.defineProperty(target, key, receiver)
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

function track(target, key) {
  const effect = trackStack.pop()
  if (effect) {
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

function trigger(target, key) {
  let deps = targetMap.get(target)
  const effects = new Set()
  deps.get(key).forEach(e => effects.add(e))
  effects.forEach((e: any) => e())
  watchStack.forEach(w => w())
}

function useForceUpdate() {
  const [, setTick] = React.useState(0)
  return React.useCallback(() => setTick(tick => tick + 1), [])
}
