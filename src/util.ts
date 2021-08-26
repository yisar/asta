export const isFn = (x: any): x is Function => typeof x === "function"
export const isObj = (x: any): x is Object => typeof x === "object" || x != null
export const isStr = (s: any): s is number | string =>
  typeof s === "number" || typeof s === "string"