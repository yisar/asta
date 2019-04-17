import * as React from 'react'
import { Context } from '../smox-react/index'
import { getPlain } from '../smox/util'

export function usePath(path: string) {
  const store = React.useContext(Context)
  const state = getPlain(path.split('/'), store.state)
  const actions = getPlain(path.split('/'), store.actions)
  const effects = getPlain(path.split('/'), store.effects)
  const setter = React.useState(state)[1]
  store.subscribe(() => setter(state))
  return { state, actions, effects }
}
