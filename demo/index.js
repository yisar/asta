import React from 'react'
import { watch, reactive } from '../dist/react'
import { render } from 'react-dom'

function useForceUpdate() {
  const [, setTick] = React.useState(0)
  return React.useCallback(() => setTick(tick => tick + 1), [])
}

function setup(component) {
  let vdom = null
  return React.memo(props => {
    if (!vdom) {
      vdom = component(props)
      const update = useForceUpdate()
      watch(() => {
        update()
        console.log(111)
      })
    }

    let res = vdom(props)
    return res
  })
}

const App = setup(() => {
  const data = reactive({ count: 0 })
  return () => (
    <div>
      <div>{data.count}</div>
      <button onClick={() => data.count++}>+</button>
    </div>
  )
})
render(<App />, document.getElementById('root'))
