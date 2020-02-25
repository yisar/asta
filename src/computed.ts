import { watch, isFn, activeEffect,Ref } from './index'

export function computed<T>(options: Getter<T> | Accessor<T>): Ref<T> {
  let dirty = true
  let value: T
  let getter: Getter<T>
  let setter: Setter<T>
  if (isFn(options)) {
    getter = options
  } else {
    getter = options.get
    setter = options.set
  }
  const effect = watch(getter, () => (dirty = true))
  return {
    isRef: true,
    effect,
    get value() {
      if (dirty) {
        value = effect()
        dirty = false
      }
      effect.deps.forEach(trackChild)
      return value
    },
    set value(newValue: T) {
      setter && setter(newValue)
    }
  } as any
}

function trackChild(dep) {
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}

interface Accessor<T> {
  get: Getter<T>
  set: Setter<T>
}

type Getter<T> = () => T
type Setter<T> = (v: T) => void
