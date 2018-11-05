import React, { useState } from 'react'
import { produce } from '../smox/produce'

export const useSmox = (initState, mutations, actions) => {
  const [state, setState] = useState(initState)

  const commit = (type, payload) => {
    if (type.indexOf('/') > -1) {
      var model = type.split('/')[0]
      type = type.split('/')[1]
    }

    let newState
    if (model) {
      newState = produce(state, state => {
        mutations[model][type](state, payload)
      })
    } else {
      newState = produce(state, state => {
        mutations[type](state, payload)
      })
    }

    if (newState !== state) {
      setState(newState)
    }
  }

  const dispatch = (type, payload) => {

    return Promise.resolve(actions[type]({ commit, dispatch }, payload))
    
  }
  return [state, commit, dispatch]
}
