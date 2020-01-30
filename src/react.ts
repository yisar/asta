import * as React from 'react'
import { watch, unwatch, reactive, raw, isReactive } from './reactivity'

function setup(factory) {
  let FN = null
  const wrapped = React.memo(props => {
    if (!FN) FN = factory(props)
    const update = React.useReducer(s => s + 1, 0)[1]
    let vdom = null
    const reaction = watch(() => (vdom = FN(props)), {
      scheduler: () => update()
    })
    return vdom
  })
  return wrapped
}

export { setup, watch, unwatch, reactive, raw, isReactive }
