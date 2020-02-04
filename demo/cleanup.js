import React from 'react'
import { setup, reactive, watch, computed, ref, onMounted } from './react'
import { render } from 'react-dom'

const App = setup(() => {
  console.log('once')
  const data = reactive({ count: 0, num: 10 })
  const cleanup = watch(
    () => data.count,
    (count, oldCount) => {
      console.log(data.count)
    }
  )
  cleanup(() => console.log('cleanup'))
  return () => (
    <div>
      <div>{data.count}</div>
      <button onClick={() => data.count++}>+</button>
    </div>
  )
})
render(<App />, document.getElementById('root'))
