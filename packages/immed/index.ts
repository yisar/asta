let copy: Object = {}
let make: boolean = false

export function produce(state: Object, produce: Function): Object {
  let newState: object = proxy(state)

  produce(newState)

  return make ? copy : state
}

function proxy(state: Object) {
  let handler = {
    get(obj: Object, key: string) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        return new Proxy(obj[key], handler)
      }
      return make ? copy[key] : obj[key]
    },
    set(_: undefined, key: string, val: any) {
      copy[key] = val
      make = true
      return true
    }
  }

  return new Proxy(state, handler)
}

function defineProperty(state: Object): Object {
  let copy = JSON.parse(JSON.stringify(state))
  let newState: Object = {}
  Object.keys(copy).forEach(key => {
    if (typeof copy[key] === 'object') defineProperty(copy[key])
    newState = walk(copy, key, copy[key])
  })

  function walk(obj: Object, key: string, val: any) {
    return Object.defineProperty(obj, key, {
      get() {
        return val
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal
        }
      },
      enumerable: true
    })
  }

  return newState
}
