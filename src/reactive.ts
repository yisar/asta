const g = typeof window === 'object' ? window : Function('return this')()
const targetMap = new WeakMap<Raw, EffectForRaw>()
const proxyToRaw = new WeakMap<Proxy, Raw>()
const rawToProxy = new WeakMap<Raw, Proxy>()
const hasOwnProperty = Object.prototype.hasOwnProperty
const effectStack: Effect[] = []
export let activeEffect = null
const ITERATE_KEY = Symbol('iterate key')
const enum Const {
  ADD = 'add',
  DELETE = 'delete'
}

export function watch<T>(fn: Function, scheduler: Function): Effect {
  const effect: Effect = function effect() {
    return run(effect, fn, this, arguments)
  }
  effect.active = true
  effect.scheduler = scheduler
  effect()
  return effect
}

function run(effect, fn, ctx, args) {
  if (!effect.active) {
    return Reflect.apply(fn, ctx, args)
  }
  if (effectStack.indexOf(effect) === -1) {
    cleanup(effect)
    try {
      effectStack.push(effect)
      activeEffect = effect
      return Reflect.apply(fn, ctx, args)
    } finally {
      effectStack.pop()
      activeEffect = effectStack[effectStack.length - 1]
    }
  }
}

export function unwatch(effect: Effect): void {
  if (effect.active) {
    cleanup(effect)
    effect.active = false
  }
}

function cleanup(effect: Effect): void {
  if (effect.deps) {
    effect.deps.forEach((deps: EffectForKey) => deps.delete(effect))
  }
  effect.deps = []
}

function buildIn({ constructor }: Raw) {
  return isFn(constructor) && constructor.name in g && g[constructor.name] === constructor
}

export function reactive<T extends Raw>(raw: T): T {
  if (proxyToRaw.has(raw) || !buildIn(raw)) return raw
  const proxy = rawToProxy.get(raw)
  if (proxy) {
    return proxy as T
  }
  const reactive = new Proxy(raw, baseHandlers)

  rawToProxy.set(raw, reactive)
  proxyToRaw.set(reactive, raw)
  targetMap.set(raw, new Map() as EffectForRaw)

  return reactive as T
}

const baseHandlers = {
  get(target: Raw, key: Key) {
    const result = Reflect.get(target, key)
    if (typeof key === 'symbol') return result
    track({ target, key, type: 'get' })
    const proxy = rawToProxy.get(result)
    if (isObj(result)) {
      if (proxy) return proxy
      return reactive(result)
    }
    return proxy || result
  },
  ownKeys(target: Raw) {
    track({ target, type: 'iterate' })
    return Reflect.ownKeys(target)
  },
  has(target: Raw, key: Key) {
    const result = Reflect.has(target, key)
    track({ target, key, type: 'has' })
    return result
  },
  set(target: Raw, key: Key, value: any) {
    if (isObj(value)) value = proxyToRaw.get(value) || value
    const hadKey = hasOwnProperty.call(target, key)
    const oldValue = target[key]
    const result = Reflect.set(target, key, value)

    if (!hadKey) {
      trigger({ target, key, value, type: 'add' })
    } else if (value !== oldValue) {
      trigger({ target, key, value, oldValue, type: 'set' })
    }
    return result
  },
  deleteProperty(target: Raw, key: Key) {
    const hadKey = hasOwnProperty.call(target, key)
    const oldValue = target[key]
    const result = Reflect.deleteProperty(target, key)
    if (hadKey) {
      trigger({ target, key, oldValue, type: 'delete' })
    }
    return result
  }
}

export function track(operation: Operation) {
  const effect: Effect = effectStack[effectStack.length - 1]
  if (effect) {
    let { type, target, key } = operation
    if (type === 'iterate') key = ITERATE_KEY
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key)
    if (!deps) {
      depsMap.set(key, (deps = new Set()))
    }
    if (!deps.has(effect)) {
      deps.add(effect)
      effect.deps.push(deps)
    }
  }
}

export function trigger(operation: Operation) {
  let { type, target, key } = operation
  let deps = targetMap.get(target)
  const effects = new Set()
  add(deps, key, effects)
  if (type === Const.ADD || type === Const.DELETE) {
    const iKey = Array.isArray(target) ? 'length' : ITERATE_KEY
    add(deps, iKey, effects)
  }
  effects.forEach((e: Effect) => {
    isFn(e.scheduler) ? e.scheduler(e) : e()
  })
}

function add(deps, key, effects) {
  const dep = deps.get(key)
  dep && dep.forEach(e => effects.add(e))
}

export const isReactive = (proxy: Object): boolean => proxyToRaw.has(proxy)

export const isObj = (x: any): x is object => typeof x === 'object'
export const isFn = (x: any): x is Function => typeof x === 'function'

type Effect = Function & {
  active?: boolean
  scheduler?: Function
  deps?: EffectForKey[]
}

interface Operation {
  type: 'get' | 'iterate' | 'add' | 'set' | 'delete' | 'clear' | 'has'
  target: object
  key?: Key
  value?: any
  oldValue?: any
}

type EffectForKey = Set<Effect>
type EffectForRaw = Map<Key, EffectForKey>
type Key = string | number | symbol
type Raw = object
type Proxy = object
