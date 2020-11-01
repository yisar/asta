import { memo, useReducer, useRef, useEffect } from 'react'
import { observable, observe, unobserve } from './index'

function setup(factory) {
  return memo((props) => {
    const w = useRef(null)
    const update = useReducer((s) => s + 1, 0)[1]
    if (!w.current) {
      w.current = observe(
        () => factory(props),
        () => Promise.resolve().then(update)
      )
    }
    useEffect(() => () => unobserve(w.current), [])
    return w.current()
  })
}

export { setup, observable, observe, unobserve }
