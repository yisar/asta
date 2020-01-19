const activeEffect = []
export const targetMap = new WeakMap()

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

export function setup(fn) {
  const render = fn()
  return applyEffect(render)
}

function applyEffect(fn) {
  return function effect(...args) {
    return run(effect, fn, args)
  }
}

function run(effect, fn, args) {
  if (activeEffect.indexOf(effect) === -1) {
    try {
      activeEffect.push(effect)
      return fn(...args)
    } finally {
      activeEffect.pop()
    }
  }
}

export function trigger(target, key) {
  let deps = targetMap.get(target)
  const effects = new Set()

  deps.get(key).forEach(e => effects.add(e))
  effects.forEach((e: any) => e())
}

export function track(target, key) {
  const effect = activeEffect[activeEffect.length - 1]
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
