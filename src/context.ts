import { observe, observable } from './observer'
import { Block } from './block'
import { Directive } from './directives'
import { queueJob } from './scheduler'
import { inOnce } from './walk'

export interface Context {
  key?: any
  scope: Record<string, any>
  dirs: Record<string, Directive>
  blocks: Block[]
  effect: any,
  effects: any[]
  cleanups: (() => void)[]
}

export const createContext = (parent?: Context): Context => {
  const ctx: Context = {
    ...parent,
    scope: parent ? parent.scope : observable({}),
    dirs: parent ? parent.dirs : {},
    effects: [],
    blocks: [],
    cleanups: [],
    effect: (fn:any) => {
      if (inOnce) {
        queueJob(fn)
        return fn as any
      }
      const e = observe(fn, () => queueJob(fn))
      ctx.effects.push(e)
      return e
    }
  }
  return ctx
}

export const createScopedContext = (ctx: Context, data = {}): Context => {
  const parentScope = ctx.scope
  const mergedScope = Object.create(parentScope)
  Object.defineProperties(mergedScope, Object.getOwnPropertyDescriptors(data))
  mergedScope.$refs = Object.create(parentScope.$refs)
  const reactiveProxy = observable(
    new Proxy(mergedScope, {
      set(target, key, val, receiver) {
        // when setting a property that doesn't exist on current scope,
        // do not create it on the current scope and fallback to parent scope.
        if (receiver === reactiveProxy && !target.hasOwnProperty(key)) {
          return Reflect.set(parentScope, key, val)
        }
        return Reflect.set(target, key, val, receiver)
      }
    })
  )
  return {
    ...ctx,
    scope: reactiveProxy
  }
}
