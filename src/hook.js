import React, { useState } from 'react'
import {produce} from '../smox/produce'


export const useSmox = (mutations,actions, initState) => {
  const [state, setState] = useState(initState)
  function commit(type,payload) {
    let newState = produce(state,state=>{
      mutations[type](state,payload)
    })

    if(newState!==state){
      setState(newState)
    }
  }

  function dispatch(type,payload){
    console.log(actions)
    return Promise.resolve(actions[type]({commit,dispatch}, payload))
  }
  return [state,commit,dispatch]
}
