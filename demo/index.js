import React from 'react'
import { setup, reactive, watch, computed, ref, onMounted } from './react'
import { render } from 'react-dom'

const App = setup(() => {
  console.log('once')
  const data = reactive({ count: 0, num: 10 })
  const num = ref(10)
  const double = computed(() => data.count * 2)
  watch(double, (cleanup, count, oldCount) => {
    cleanup(() => console.log('cleanup', count, oldCount))
    console.log(data.count)
  })
  return () => (
    <div>
      <div>{data.count}</div>
      <div>{num.value}</div>
      <div>{double.value}</div>
      <button onClick={() => data.count++}>+</button>
      <button onClick={() => num.value--}>-</button>
    </div>
  )
})
render(<App />, document.getElementById('root'))
