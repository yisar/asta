import * as React from 'react'
import { watch, unwatch, reactive, raw, isReactive } from './reactivity'

function useForceUpdate() {
  const [, setTick] = React.useState(0)
  return React.useCallback(() => setTick(tick => tick + 1), [])
}

function setup(component) {
  let vdom = null
  return React.memo(props => {
    if (!vdom) vdom = component(props)
    const update = useForceUpdate()
    watch(() => update())
    let res = vdom(props)
    return res
  })
}

export { setup, watch, unwatch, reactive, raw, isReactive }
