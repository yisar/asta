import React from 'react'
import { setup, reactive, watch, computed, ref } from './react'
import { render } from 'react-dom'

const App = setup(() => {
  const data = reactive({ count: 0 })
  const num = ref(0)
  const double = computed(() => data.count * 2)
  watch(() => console.log(double.value))
  return () => (
    <div>
      <div>{data.count}</div>
      <div>{num.value}</div>
      <div>{double.value}</div>
      <button onClick={() => data.count++}>+</button>
    </div>
  )
})
render(<App />, document.getElementById('root'))
