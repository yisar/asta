import React from 'react'
import { watch, unwatch, reactive, computed, ref, raw, isReactive, isRef } from '../dist/index'

function setup(factory, render) {
  return React.memo(props => {
    if (!render) render = factory(props)
    const update = React.useReducer(s => s + 1, 0)[1]
    const vdom = watch(() => render(props), {
      scheduler: () => Promise.resolve().then(update)
    })
    React.useEffect(() => () => unwatch(vdom), [])
    return vdom()
  })
}

export { setup, watch, unwatch, ref, computed, reactive, raw, isReactive, isRef }
