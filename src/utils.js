export function resolveSource(source, type) {
  return typeof type === 'function' ? type : source[type]
}

export function bindCreators(creators, operate) {
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = (...args) => operate(creators[item], ...args)
    return ret
  }, {})
}

export function normalizeMap(map) {
  return Array.isArray(map)
    ? map.map(k => ({k, v: k}))
    : Object.keys(map).map(k => ({k, v: map[k]}))
}

export function mapMethods(method, methods) {
  let res = {}
  for (let { k, v } of normalizeMap(methods)) {
    res[k] = method[v]
  }
  return res
}