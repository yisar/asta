import React from 'react'
import { watch as effect, unwatch, reactive, computed, ref, raw, isReactive, isRef } from '../dist/index'

function setup(factory) {
  return React.memo(props => {
    const update = React.useReducer(s => s + 1, 0)[1]
    const w = React.useRef()
    const r = React.useRef()
    if (!r.current) r.current = factory(props)
    let getter = isFn(r.current) ? () => r.current(props) : () => factory(props)
    if (!w.current) {
      w.current = effect(getter, () => update())
    }
    React.useEffect(() => () => unwatch(w.current), [])
    return w.current()
  })
}

function watch(src, cb) {
  let oldValue = null
  let update = () => {
    let newValue = runner()
    isChanged(oldValue, newValue) && cb(newValue, oldValue)
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
    getter = src
    update = null
  }
  const runner = effect(getter, update)

  return () => unwatch(runner)
}
const isChanged = (a, b) => a !== b
const isFn = x => typeof x === 'function'
export { setup, watch, unwatch, ref, computed, reactive, raw, isReactive, isRef }
