export function resolveSource(source, type, name) {
  if (typeof type === 'function') {
    return type
  }
  return Array.isArray(type) ? source[type[0]][type[1]] : name ? source[name][type] : source[type]
}
export function bindCreators(creators, operate, name) {
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = (...args) => operate(creators[item], ...args, name)
    return ret
  }, {})
}
export function normalizeMap(map) {
  return Array.isArray(map)
    ? map.map(k => ({ k, v: k }))
    : Object.keys(map).map(k => ({ k, v: map[k] }))
}

export function splitContent(type) {
  let res = []
  type.map(i => {
    type.indexOf('/') != -1 ?
      res.push(i.split('/')[1]) :
      res.push(i)
  })
  return res
}

export function splitType(type) {
  if (typeof type === 'function') {
    return type
  }
  return type.indexOf('/') != -1 ?
    type.split('/') : type

}

export function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((res, item) => (...args) => res(item(...args)))
}