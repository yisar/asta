import React from 'react'
import { setup, onMounted, onUnmounted, onUpdated, onBeforeUpdated } from './react'
import { render } from 'react-dom'

const App = setup(() => {
  onMounted(() => console.log('mounted'))
  onUnmounted(() => console.log('unmounted'))
  onUpdated(() => console.log('updated'))
  onBeforeUpdated(() => console.log('befrore-updated'))
  return () => <div>hello world</div>
})
render(<App />, document.getElementById('root'))
