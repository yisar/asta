const targetMap = new WeakMap<Raw, ReactionForRaw>()
const proxyToRaw = new WeakMap<Proxy, Raw>()
const rawToProxy = new WeakMap<Raw, Proxy>()
const ITERATE_KEY = Symbol('iterate key')
const IS_REACTION = Symbol('is reaction')
const isObj = (x: any): x is object => typeof x === 'object'
const hasOwnProperty = Object.prototype.hasOwnProperty
const reactionStack = []

const enum Type {
  ADD = 'add',
  DELETE = 'delete'
}

export function watch(fn: Function): Reaction {
  const reaction = fn[IS_REACTION]
    ? fn
    : function reaction() {
        return run(reaction, fn, this, arguments)
      }
  reaction[IS_REACTION] = true
  reaction()
  return reaction
}

function run(reaction, fn, ctx, args) {
  if (reaction.unwatch) {
    return Reflect.apply(fn, ctx, args)
  }
  if (reactionStack.indexOf(reaction) === -1) {
    releaseReaction(reaction)
    try {
      reactionStack.push(reaction)
      return Reflect.apply(fn, ctx, args)
    } finally {
      reactionStack.pop()
    }
  }
}

export function unwatch(reaction: Reaction): void {
  if (!reaction.unwatched) {
    reaction.unwatched = true
    releaseReaction(reaction)
  }
}

function releaseReaction(reaction: Reaction): void {
  if (reaction.cleanup) {
    reaction.cleanup.forEach((deps: ReactionForKey) => deps.delete(reaction))
  }
  reaction.cleanup = []
}

export function reactive<T extends Raw>(raw: T): T {
  // todo shouldInstrument
  if (proxyToRaw.has(raw)) return raw
  const proxy = rawToProxy.get(raw)
  if (proxy) {
    return proxy as T
  }
  return createReactive(raw)
}

function createReactive<T extends Raw>(raw: T): T {
  const reactive = new Proxy(raw, baseHandlers)
  rawToProxy.set(raw, reactive)
  proxyToRaw.set(reactive, raw)
  targetMap.set(raw, new Map() as ReactionForRaw)
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

function track(operation: Operation) {
  const reaction: Reaction = reactionStack[reactionStack.length - 1]
  if (reaction) {
    let { type, target, key } = operation
    if (type === 'iterate') {
      key = ITERATE_KEY
    }
    const depsMap = targetMap.get(target)
    let deps = depsMap.get(key)
    if (!deps) {
      depsMap.set(key, (deps = new Set()))
    }
    if (!deps.has(reaction)) {
      deps.add(reaction)
      reaction.cleanup.push(deps)
    }
  }
}

function trigger(operation: Operation) {
  let { type, target, key } = operation
  let deps = targetMap.get(target)
  const effects = new Set()
  add(deps, key, effects)
  if (type === Type.ADD || type === Type.DELETE) {
    const iKey = Array.isArray(target) ? 'length' : ITERATE_KEY
    add(deps, iKey, effects)
  }
  effects.forEach((e: any) => e())
}

function add(deps, key, effects) {
  const reactions = deps.get(key)
  reactions && reactions.forEach(e => effects.add(e))
}

export function raw(proxy: Proxy) {
  return proxyToRaw.get(proxy) || proxy
}

export function isReactive(proxy: Object) {
  return proxyToRaw.has(proxy)
}

type Reaction = Function & {
  IS_REACTION?: boolean
  unwatched?: boolean
  cleanup?: ReactionForKey[]
}

interface Operation {
  type: 'get' | 'iterate' | 'add' | 'set' | 'delete' | 'clear' | 'has'
  target: object
  key?: Key
  value?: any
  oldValue?: any
}
type ReactionForKey = Set<Reaction>
type ReactionForRaw = Map<Key, ReactionForKey>
type Key = string | number | symbol
type Raw = object
type Proxy = object
