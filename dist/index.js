let state = {
  counter: {
    count: 0
  }
}

let actions = {
  counter: {
    up(state) {
      state.count++
    },
    async upAsync(actions) {
      await new Promise(t => setTimeout(t, 1000))
      actions.up()
    }
  }
}

let store = new smox.Store({ state, actions })
store.actions.counter.upAsync()