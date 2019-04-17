import * as React from 'react'
import { Context } from '../smox-react/index'
import {getPlain} from '../smox/util'

export function usePath(path: string, store: any) {
  if (!store) store = React.useContext(Context)
  let state = getPlain(path.split('/'),store.state)
  const setter = React.useState(state)[1]
  store.subscribe(() => setter(state))
  return store
}
