export function setState(path: string[], value: any, source: any) {
  let target = {}
  if (path.length) {
    target[path[0]] =
      path.length > 1 ? setState(path.slice(1), value, source[path[0]]) : value
    return { ...source, ...target }
  }
  return value
}

export function getState(path: string[], source: any) {
  let i = 0
  while (i < path.length) {
    source = source[path[i++]]
  }
  return source
}
