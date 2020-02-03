import React from 'react'
import { setup, onMounted, onUnmounted, onUpdated, onBeforeUpdated, onBeforeMounted, onBeforeUnmounted } from './react'
import { render } from 'react-dom'

const App = setup(() => {
  onMounted(() => console.log('mounted'))
  onUnmounted(() => console.log('unmounted'))
  onUpdated(() => console.log('updated'))
  onBeforeUpdated(() => console.log('befrore-updated'))
  onBeforeMounted(() => console.log('befrore-mounted'))
  onBeforeUnmounted(() => console.log('befrore-unmounted'))
  return () => <div>hello world</div>
})
render(<App />, document.getElementById('root'))
