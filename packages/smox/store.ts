class Store {
  state: Object
  actions: Object
  effects: Object
  constructor({ state, actions, effects }) {
    this.state = state
    this.actions = actions
    this.effects = effects
  }
}
