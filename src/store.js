import { resolveSource, splitType } from './util'
import { combineModels } from './helper'
import { produce } from './produce'
export class Store {
  constructor(models) {
    this.state = models.state ? models.state : combineModels(models).state
    this.mutations = models.state ? models.mutations : combineModels(models).mutations
    this.actions = models.state ? models.actions : combineModels(models).actions
    this.subscribers = []
    this.dispatch = this.dispatch.bind(this)
    this.commit = this.commit.bind(this)
  }
  subscribe(sub) {
    return this.subscribers.push(sub)
  }
  unsubscribe(sub) {
    return this.subscribers.filter(f => f !== sub)
  }
  dispatch(type, payload, name) {
    if (name) {
      payload = {
        name,
        payload
      }
    }
    const action = resolveSource(this.actions, type)
    const ctx = {
      commit: this.commit,
      dispatch: this.dispatch
    }
    return Promise.resolve(action(ctx, payload))
  }
  commit(type, payload, name) {
    if (payload.name) {
      name = payload.name
      payload = payload.payload
    }
    type = splitType(type)
    const mutation = resolveSource(this.mutations, type, name)
    const model = Array.isArray(type) ? type[0] : name
    typeof type === 'function' && name ?
      this.state[name] = produce(this.state[name], state => {
        mutation(state, payload)
      }) : model ?
        this.state[model] = produce(this.state[model], state => {
          mutation(state, payload)
        }) :
        this.state = produce(this.state, state => {
          mutation(state, payload)
        })
    this.subscribers.forEach(v => v())
  }
}
