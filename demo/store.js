import React from 'react'
import { setup, reactive } from './react'
import { render } from 'react-dom'

const store = reactive({
  count: 0,
})
const App = setup(() => {
  return () => (
    <div>
      <A />
      <B />
      <button onClick={() => store.count++}>+</button>
    </div>
  )
})

const A = setup(() => {
  console.log('A')
  return () => <div>{store.count}</div>
})
const B = setup(() => {
  console.log('B')
  return () => <div>{store.count}</div>
})
render(<App />, document.getElementById('root'))
