import React from 'react'
import ReactDOM from 'react-dom'
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
    }
  },
  change(state) {
    state.sex = state.sex === 'boy' ? 'girl' : 'boy'
  }
}

const effects = {
  async getList(actions){
    const data = await axios.get('http://www.baidu.com').then(res=>{
      return res.data
    })
    actions.render(data)
  }
}

const store = new Smox({ state, actions, effects })

@map({
  state: ['counter/count', 'sex'],
  actions: ['counter/up', 'counter/up', 'change'],
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
