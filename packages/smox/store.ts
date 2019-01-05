import { getPartialState, setPartialState } from './util'
// import { produce } from '../../ignore/smox/produce'
import { produce } from '../immed/index'

export class Store {
  state: Object
  actions: Object
  constructor({ state = {}, actions = {} }) {
    this.state = state
    this.actions = this.wireActions([], state, actions)
  }

  wireActions(path: string[], state: Object, actions: Object) {
    Object.keys(actions).forEach(key => {
      typeof actions[key] === 'function'
        ? (function(key, action) {
            actions[key] = function(data) {
              let res = action(state, data)

              if (typeof res === 'function') {
                res = res(getPartialState(path, this.state))
              }

              this.state = setPartialState(path, res, this.state)

              return res
            }
          })(key, actions[key])
        : this.wireActions(path.concat(key), state[key], actions[key])
    })

    return actions
  }
}
