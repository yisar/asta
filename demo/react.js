import React from 'react'
import { watch as effect, unwatch, reactive, computed, ref, toRefs, isReactive, isRef } from '../dist/index'

let currentVdom = null

function setup(factory) {
  let vdom = React.memo(props => {
    const update = React.useReducer(s => s + 1, 0)[1]
    const w = React.useRef()
    const r = React.useRef()
    if (!r.current) r.current = factory(props)
    let getter = isFn(r.current) ? () => r.current(props) : () => factory(props)
    if (!w.current) {
      w.current = effect(getter, () => update())
    }
    React.useEffect(
      () => () => {
        unwatch(w.current)
        vdom.cleanup.forEach(c => c())
      },
      []
    )
    return w.current()
  })
  currentVdom = vdom
  currentVdom.cleanup = new Set()
  return vdom
}

function watch(src, cb) {
  let oldValue = null
  let cleanup = null
  let update = () => {
    let newValue = runner()
    if (isChanged(oldValue, newValue)) {
      if (currentVdom.cleanup.has(cleanup)) {
        currentVdom.cleanup.delete(cleanup)
      }
      cleanup && cleanup()
      cb(newValue, oldValue)
    }
    oldValue = newValue
  }
  let getter = null
  if (Array.isArray(src)) {
    getter = () => src.map(s => (isRef(s) ? s.value : s()))
  } else if (isRef(src)) {
    getter = () => src.value
  } else if (cb) {
    getter = src
  } else {
    getter = () => {
      if (currentVdom.cleanup.has(cleanup)) {
        currentVdom.cleanup.delete(cleanup)
      }
      cleanup && cleanup()
      src()
    }
    update = null
  }
  const runner = effect(getter, update)
  return cb => {
    cleanup = cb
    currentVdom.cleanup.add(cb)
    currentVdom.cleanup.add(() => unwatch(runner))
  }
}

const isChanged = (a, b) => !a || (Array.isArray(b) ? b.some((arg, index) => arg !== a[index]) : a !== b)
const isFn = x => typeof x === 'function'
export { setup, watch, unwatch, ref, computed, reactive, toRefs, isReactive, isRef }
