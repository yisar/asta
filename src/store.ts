import { resolveSource } from './util'
import { produce } from './produce'

interface Fnc {
  [k: string]: Function
}

export class Store {
  state: any
  mutations: Fnc
  actions: Fnc
  subscribers: Function[]
  constructor({ state, mutations, actions }) {
    this.state = state
    this.mutations = mutations
    this.actions = actions
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
    const action = resolveSource(this.actions, type)
    const ctx = {
      commit: this.commit,
      dispatch: this.dispatch
    }
    return Promise.resolve(action(ctx, payload))
  }

  commit(type: Function | string, payload) {
    const mutation = resolveSource(this.mutations, type)
    this.state = produce(this.state, (draft) => {
      mutation(draft, payload)
    })
    this.subscribers.forEach(v => v())
  }
}