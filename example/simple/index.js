import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import { Store, Provider } from './smox/index'

const state = {
  count: 2
}

const mutations = {
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

const actions = {
  asyncAdd({ commit }) {
    setTimeout(() => {
      commit('add')
    }, 1000)
  }
}

const store = new Store({ state, mutations, actions })

ReactDOM.render(
  <Provider value={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
