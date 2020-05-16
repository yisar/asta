import React from 'react'
import { setup, reactive } from './react'
import { render } from 'react-dom'

const store = reactive({
  count: 0,
})
const App = setup(() => (
  <div>
    <A/>
    <div>{store.count}</div>
    <button onClick={() => store.count++}>+</button>
  </div>
))

const A = setup(() => <div>{store.count}</div>)
render(<App />, document.getElementById('root'))
