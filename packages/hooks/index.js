import React from 'react'
import { Context } from '../smox-react/index'

export function useStore (store) {
  if (!store) store = React.useContext(Context)

  const setter = React.useState(store.state)[1]
  store.subscribe(() => setter(store.state))

  return store
}
