import React, { memo, useEffect, useRef, useReducer } from 'react'
import { observable, observe, unobserve } from '../dist/doux.esm'
import { render } from 'react-dom'

const data = observable({ count: 0 })

const A = setup((props) => {
  return (
    <div>
      <div>{data.count}</div>
      <button onClick={() => data.count++}>+</button>
    </div>
  )
})

const B = setup((props) => {
  console.log('b')
  return (
    <div>
      <div>{data.count}</div>
      <button onClick={() => data.count--}>-</button>
    </div>
  )
})

const C = setup((props) => {
  console.log('c')
  return <div>C</div>
})

function App() {
  return (
    <div>
      <A />
      <B />
      <C />
    </div>
  )
}

function setup(factory) {
  return memo((props) => {
    const w = useRef()
    const update = useReducer((s) => s + 1, 0)[1]
    if (!w.current) {
      w.current = observe(
        () => factory(props),
        () => update()
      )
    }
    useEffect(() => () => unobserve(w.current), [])
    return w.current()
  })
}

render(<App foo={1} />, document.getElementById('root'))
