import { createStore, applyMiddleware } from './src/smox'
import { connect, Provider, Consumer } from './src/smox-react'
import  thunk  from './src/smox-thunk'
import arrayThunk from './src/smox-array'


module.exports ={
  createStore,
  applyMiddleware,
  connect,
  Provider,
  Consumer,
  thunk,
  arrayThunk
}