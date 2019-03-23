import React from 'react'
import ReactDOM from 'react-dom'
import { Smox, useStore } from '../../packages/index'

const state = {
  counter: {
    count: 0
  },
  sex: 'boy'
}

const actions = {
  counter: {
    up (state, data) {
      state.count += data
    },
    down (state, data) {
      state.count -= data
    }
  },
  change (state) {
    state.sex = state.sex === 'boy' ? 'girl' : 'boy'
  }
}

const effects = {
  counter: {
    async upAsync (actions, data) {
      await new Promise(t => setTimeout(t, 1000))
      actions.up(data)
    }
  }
}

const store = new Smox({ state, actions, effects })

function App () {
  const { state, actions, effects } = useStore(store)

  return (
    <>
      <div>{state.counter.count}</div>
      <button onClick={() => actions.counter.up(1)}>+</button>
      <button onClick={() => effects.counter.upAsync(1)}>x</button>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
