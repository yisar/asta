import React from 'react'
import { setup, reactive, watch, computed, ref } from './react'
import { render } from 'react-dom'

const store = reactive({
  count: 0
})
const App = setup(() => (
  <div>
    <div>{store.count}</div>
    <button onClick={() => store.count++}>+</button>
  </div>
))

render(<App />, document.getElementById('root'))
