function produce(state, produce) {
  let newState = Proxy ? proxy(state) : defineProperty(state)

  produce(newState)

  return newState
}

function proxy(state) {
  let copy = {}
  let make
  let handler = {
    get(target, key) {
      if (typeof target[key] === 'object' && target[key] !== null) {
        return new Proxy(target[key], handler)
      }
      return make ? copy[key] : target[key]
    },
    set(target, key, value) {
      copy[key] = value
      make = true
      return true
    }
  }

  return new Proxy(state, handler)
}

function defineProperty(state) {
  let copy = JSON.parse(JSON.stringify(state))
  let newState = {}
  Object.keys(copy).forEach(key => {
    if (typeof copy[key] === 'object') defineProperty(copy[key])
    newState = walk(copy, key, copy[key])
  })

  function walk(obj, key, val) {
    return Object.defineProperty(obj, key, {
      get() {
        return val
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal
          make = true
        }
      },
      enumerable: true
    })
  }

  return newState
}
