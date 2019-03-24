import React from 'react'
import ReactDOM from 'react-dom'
import { Store, Provider, Subscribe } from '../../packages/index'
import { Context } from '../../packages/smox-react/index'

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

const store = new Store({ state, actions, effects })

// export function useStore (store) {
//   if (!store) store = React.useContext(Context)

//   const setter = React.useState(store.state)[1]
//   store.subscribe(() => setter(store.state))

//   return store
// }

class App extends React.Component {
  render () {
    return (
      <Subscribe
        to={({state,actions,effects}) => (
          <>
          {console.log(state)}
            <div>{state.counter.count}</div>
            <button onClick={() => actions.counter.up(1)}>+</button>
            <button onClick={() => effects.counter.upAsync(1)}>x</button>
          </>
        )}
      />
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
