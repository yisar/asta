import { produce } from '../immed/index'
import { setPlain } from './util'

export class Smox {
  state: any
  actions: any
  effects: any
  subs: Function[]
  constructor({ state = {}, actions = {}, effects = {} }) {
    this.state = state
    this.actions = this.wireActions([], state, actions)
    this.effects = this.wireEffects([], actions, effects)
    this.subs = []
  }

  private wireActions(path: string[], state: Object, actions: Object) {
    Object.keys(actions).forEach(key => {
      typeof actions[key] === 'function'
        ? ((key, action) => {
            actions[key] = function(data) {
              let res: any = produce(state, path, draft => {
                action(draft, data)
              })
              this.state = setPlain(path, res, this.state)
              this.subs.forEach(fun => fun())
            }.bind(this)
          })(key, actions[key])
        : this.wireActions(path.concat(key), state[key], actions[key])
    })

    return actions
  }

  private wireEffects(path: string[], actions: Object, effects: Object) {
    Object.keys(effects).forEach(key => {
      typeof effects[key] === 'function'
        ? ((key, effect) => {
            effects[key] = function(data) {
              effect(actions, data)
            }
          })(key, effects[key])
        : this.wireEffects(path.concat(key), actions[key], effects[key])
    })

    return effects
  }

  subscribe(sub) {
    this.subs.push(sub)
  }
  unsubscribe(sub) {
    this.subs = this.subs.filter(f => f !== sub)
  }
}
