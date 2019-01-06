import { produce } from './immed/index'
import { Store } from './smox/store'
let state = {
  counter: {
    count: 0
  }
}

let actions = {
  counter: {
    up(state) {
      state.count++
    }
  }
}

let store = new Store({ state, actions })
store.actions.counter.up()
store.actions.counter.up()

store.subscribe(console.log(store.state))

export { produce, Store }
