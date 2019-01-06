import { getState, setState } from './util'
import { produce } from '../immed/index'

export class Store {
  state: any
  actions: any
  subs: Function[]
  constructor({ state = {}, actions = {} }) {
    this.state = state
    this.actions = this._wireActions([], state, actions)
    this.subs = []
  }

  private _wireActions(path: string[], state: Object, actions: Object) {
    Object.keys(actions).forEach(key => {
      typeof actions[key] === 'function'
        ? ((key, action) => {
            actions[key] = function(data) {
              let res: any = produce(state, draft => {
                action(draft, data)
              })

              if (res && res !== getState(path, this.state) && !res.then) {
                this.state = setState(path, res, this.state)
                this.subs.forEach(v => v())
              }

              return res
            }.bind(this)
          })(key, actions[key])
        : this._wireActions(path.concat(key), state[key], actions[key])
    })

    return actions
  }

  subscribe(sub) {
    return this.subs.push(sub)
  }
  unsubscribe(sub) {
    return this.subs.filter(f => f !== sub)
  }
}
