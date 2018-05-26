import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import Smox from '../index'
import { Provider } from '../index'

const state = {
  count: 2
}

const actions = {
  add(state) {
    return {
      count: state.count + 1
    }
  },
  cut(state) {
    return {
      count: state.count - 1
    }
  }
}

const store = new Smox({state, actions})


ReactDOM.render(
  <Provider value={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
