import React from 'react'

export function useStore (store) {
  const setter = React.useState(store.state)[1]

  store.subscribe(() => setter(store.state))
  
  return store
}