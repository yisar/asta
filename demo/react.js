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
      w.current = effect(getter, {
        scheduler: () => update()
      })
    }
    React.useEffect(() => () => unwatch(w.current), [])
    return w.current()
  })
}

function watch(cb, src) {
  let oldValue = null
  const applyCb = () => {
    let newValue = runner()
    oldValue !== newValue && cb()
    oldValue = newValue
  }
  const getter = isFn(src) ? src : isRef(src) ? () => src.value : () => src
  const runner = effect(getter, {
    scheduler: applyCb
  })
}

const isFn = x => typeof x === 'function'
export { setup, watch, unwatch, ref, computed, reactive, raw, isReactive, isRef }
