export function setPartialState(path:string[], value:any, source:any) {
  var target = {}
  if (path.length) {
    target[path[0]] =
      path.length > 1
        ? setPartialState(path.slice(1), value, source[path[0]])
        : value
    return {...source,...target}
  }
  return value
}

export function getPartialState(path:string[], source:any) {
  var i = 0
  while (i < path.length) {
    source = source[path[i++]]
  }
  return source
}