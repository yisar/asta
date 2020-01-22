import React from 'react'

const trackStack = []
const targetMap = new WeakMap()

const toProxy = new WeakMap()
const toRaw = new WeakMap()

const isObj = (x: any): x is object => typeof x === 'object'

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

export function setup(component) {
  const vdom = component()
  return () => {
    const update = useForceUpdate()
    trackStack.push(() => update())
    return vdom()
  }
}

export function track(target, key) {
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

export function trigger(target, key) {
  let deps = targetMap.get(target)
  const effects = new Set()
  deps.get(key).forEach(e => effects.add(e))
  effects.forEach((e: any) => e())
}

function useForceUpdate() {
  const [, setTick] = React.useState(0)
  return React.useCallback(() => setTick(tick => tick + 1), [])
}
