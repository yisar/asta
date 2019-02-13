let copy: Object = {}
let make
let oldPath

export function produce(
  state: Object,
  path: string[],
  produce: Function
): Object {
  let newState: object = proxy(state)
  if (oldPath !== path) make = false
  oldPath = path

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