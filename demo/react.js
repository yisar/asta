import React from 'react'
import { watch, unwatch, reactive, computed, ref, raw, isReactive, isRef } from '../dist/index'

function setup(factory) {
  return React.memo(props => {
    const w = React.useRef()
    const r = React.useRef()
    const update = React.useReducer(s => s + 1, 0)[1]
    if (!r.current) r.current = factory(props)
    let getter = typeof r.current === 'function' ? () => r.current(props) : () => factory(props)
    if (!w.current) {
      w.current = watch(getter, {
        scheduler: () => Promise.resolve().then(update)
      })
    }
    React.useEffect(() => () => unwatch(vdom), [])
    return w.current()
  })
}

export { setup, watch, unwatch, ref, computed, reactive, raw, isReactive, isRef }
