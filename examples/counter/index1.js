import React from 'react'
import ReactDOM from 'react-dom'
import { Smox, Provider, Path, path } from '../../packages/index'

const state = {
  counter: {
    count: 0
  },
  sex: 'boy'
}

const actions = {
  counter: {
    up (state, data) {
      state.count++
    },
    down (state, data) {
      state.count--
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

// class App extends React.Component {
//   render () {
//     return (
//       <Path to='counter'>
//         {({ state, actions, effects }) => (
//           <>
//             <div>{state.count}</div>
//             <button onClick={() => actions.up()}>+</button>
//             <button onClick={() => effects.upAsync()}>x</button>
//           </>
//         )}
//       </Path>
//     )
//   }
// }



// @path('counter')
// class App extends React.Component {
//   render () {
//     return (
//       <>
//         <h1>{this.props.count}</h1>
//         <button onClick={this.props.up}>+</button>
//         <button onClick={this.props.upAsync}>x</button>
//       </>
//     )
//   }
// }

// function App () {
//   const { state, actions, effects } = usePath('counter')

//   return (
//     <>
//       <div>{state.count}</div>
//       <button onClick={() => actions.up()}>+</button>
//       <button onClick={() => effects.upAsync()}>x</button>
//     </>
//   )
// }

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
