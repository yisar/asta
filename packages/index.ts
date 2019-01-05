import { produce } from './immed/index'
import { Store } from './smox/store'
let state = {
  counter: {
    count: 0
  }
}

let actions = {
  counter: {
    up(state, data) {
      state.count + data
    }
  }
}

let store = new Store({ state, actions })
console.log(store.actions.counter.up(1))

export { produce , Store}
