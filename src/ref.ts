import { reactive, isObj, track, trigger } from './reactive'

const convert = <T>(val: T): T => (isObj(val) ? reactive(val) : val)

export function toRefs<T extends object>(proxy: T): { [K in keyof T]: Ref<T[K]> } {
  const ret: any = {}
  for (const key in proxy) {
    ret[key] = toRef(proxy, key)
  }
  return ret
}

function toRef<T extends object, K extends keyof T>(proxy: T, key: K): Ref<T[K]> {
  return {
    isRef: true,
    get value(): any {
      return proxy[key]
    },
    set value(newVal) {
      proxy[key] = newVal
    }
  } as any
}

export function ref<T>(value?: T): Ref<T> {
  value = convert(value)
  const ref = {
    isRef: true,
    get value() {
      track({ target: ref, key: 'value', type: 'get' })
      return value
    },
    set value(newVal) {
      value = convert(newVal)
      trigger({ target: ref, key: 'value', value, type: 'set' })
    }
  }
  return ref
}

export const isRef = (r: any): boolean => (r ? r.isRef === true : false)
export interface Ref<T> {
  readonly value: T
}
