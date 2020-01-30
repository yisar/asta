import React from 'react'
import { watch, unwatch, reactive, computed, ref, raw, isReactive, isRef } from '../dist/reactivity'

function setup(factory, FN) {
  return React.memo(props => {
    if (!FN) FN = factory(props)
    const update = React.useReducer(s => s + 1, 0)[1]
    let vdom = null
    watch(() => (vdom = FN(props)), {
      scheduler: () => update()
    })
    return vdom
  })
}

export { setup, watch, unwatch, ref, computed, reactive, raw, isReactive, isRef }