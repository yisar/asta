import React, { useReducer } from 'react'
import { watch, unwatch, reactive, raw, isReactive } from '../dist/reactivity'
function setup(factory) {
  var FN = null
  var wrapped = React.memo(function(props) {
    if (!FN) FN = factory(props)
    var update = React.useReducer(function(s) {
      return s + 1
    }, 0)[1]
    var vdom = null
    var reaction = watch(
      function() {
        return (vdom = FN(props))
      },
      {
        scheduler: function() {
          return update()
        }
      }
    )
    return vdom
  })
  return wrapped
}
export { setup, watch, unwatch, reactive, raw, isReactive }
