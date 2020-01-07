import { useState, useCallback } from 'react'

export function setup(fn) {
  fn.composition = true
  return fn
}

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
      return res
    },
    set(target, key, value, receiver) {
      let res = Reflect.set(target, key, value, receiver)
      if (key in target) forceUpdate()
      return res
    },
    deleteProperty(target, key, receiver) {
      return Reflect.defineProperty(target, key, receiver)
    }
  }

  let observed = new Proxy(target, handlers as any)

  toProxy.set(target, observed)
  toRaw.set(observed, target)

  return observed
}

function forceUpdate() {
  const update = useState()[0]
  return useCallback(() => update({}), [])
}
