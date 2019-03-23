import React from 'react'

export function useStore (store) {
  const [state, setter] = React.useState(store.state)

  let update = () => setter(store.state)

  store.subscribe(update)

  return { ...store, state }
}