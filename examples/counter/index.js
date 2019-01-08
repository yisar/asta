import React from 'react'
import ReactDOM from 'react-dom'
// import { Smox, Provider, map } from '../../dist/smox'
// import { Smox, Provider, map } from 'smox'
import { Smox, Provider, map } from '../../packages/index'

const state = {
  counter: {
    count: 0
  },
  sex: 'boy'
}

const actions = {
  counter: {
    up(state, data) {
      state.count += data
    },
    down(state, data) {
      state.count -= data
    }
  },
  change(state) {
    state.sex = state.sex === 'boy' ? 'girl' : 'boy'
  }
}

const effects = {
  counter: {
    async upAsync(actions, data) {
      await new Promise(t => setTimeout(t, 1000))
      actions.up(data)
    }
  }
}

const store = new Smox({ state, actions, effects })

@map({
  state: ['counter/count', 'sex'],
  actions: ['counter/up', 'counter/down', 'change'],
  effects: ['counter/upAsync']
})
class App extends React.Component {
  render() {
    return (
      <div>
        <div>{this.props.count}</div>
        <div>{this.props.sex}</div>
        <button onClick={() => this.props.up(1)}>+</button>
        <button onClick={() => this.props.down(1)}>-</button>
        <button onClick={() => this.props.upAsync(1)}>异步</button>
        <button onClick={() => this.props.change()}>x</button>
      </div>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
