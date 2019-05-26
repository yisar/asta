import React from 'react'
import ReactDOM from 'react-dom'
import { Smox, Global, Local } from '../dist/smox'

const state = {
  count: 0
}

const actions = {
  up (state) {
    state.count++
  },
  down (state) {
    state.count--
  }
}

const effects = {
  async upAsync (actions) {
    await new Promise(t => setTimeout(t, 1000))
    actions.up()
  }
}

const store = new Smox({ state, actions, effects })

class App extends React.Component {
  render () {
    return <>
      <Local>
        {({ state, actions, effects }) => (
          <>
            <h1>{state.count}</h1>
            <button onClick={actions.up}>+</button>
            <button onClick={actions.down}>-</button>
            <button onClick={effects.upAsync}>x</button>
          </>
        )}
      </Local>
    </>
  }
}

ReactDOM.render(
  <Global store={store}>
    <App />
  </Global>,
  document.getElementById('root')
)
