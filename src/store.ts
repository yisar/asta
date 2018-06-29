import { resolveSource, combineModels, splitType } from './util'
import { produce } from './produce'

export interface Fnc {
  [k: string]: Function
}

export class Store {
  state: any
  mutations: Fnc
  actions: Fnc
  subscribers: Function[]
  constructor(models) {
    this.state = models.state ? models.state : combineModels(models).state
    this.mutations = models.state ? models.mutations : combineModels(models).mutations
    this.actions = models.state ? models.actions : combineModels(models).actions
    this.subscribers = []
    this.dispatch = this.dispatch.bind(this)
    this.commit = this.commit.bind(this)
  }

  subscribe(sub: Function) {
    return this.subscribers.push(sub)
  }

  unsubscribe(sub: Function) {
    return this.subscribers.filter(f => f !== sub)
  }

  dispatch(type: Function | string, payload) {
    type = splitType(type)
    const action = resolveSource(this.actions, type)
    const ctx = {
      commit: this.commit,
      dispatch: this.dispatch
    }
    return Promise.resolve(action(ctx, payload))
  }

  commit(type: Function | string, payload) {
    const mutation = resolveSource(this.mutations, type);
    const model = Array.isArray(type) ? type[0] : type
    typeof type === 'function' ?
      this.state[name] = produce(this.state[name], (state) => {
        mutation(state, payload);
      }) :
      this.state[model] = produce(this.state[model], (state) => {
        mutation(state, payload);
      });
    this.subscribers.forEach(v => v())
  }
}