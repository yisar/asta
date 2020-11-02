import { memo, useReducer, useRef, useEffect } from 'react'
import { observable, observe, unobserve } from './index'

function observer(factory) {
  return memo((props) => {
    const w = useRef(null)
    const update = useReducer((s) => s + 1, 0)[1]
    if (!w.current) {
      w.current = observe(
        () => factory(props),
        (e) => update() // update the state
      )
    }
    useEffect(() => () => unobserve(w.current), [])
    return w.current()
  })
}

export { observer, observable, observe, unobserve }
