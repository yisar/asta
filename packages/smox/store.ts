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


function setState(path: string[], value: any, source: any) {
  let target = {}
  if (path.length) {
    target[path[0]] =
      path.length > 1 ? setState(path.slice(1), value, source[path[0]]) : value
    return { ...source, ...target }
  }
  return value
}

function getState(path: string[], source: any) {
  let i = 0
  while (i < path.length) {
    source = source[path[i++]]
  }
  return source
}
