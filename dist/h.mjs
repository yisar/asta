const TEXT_NODE = 3
const EMPTY_OBJ = {}
const EMPTY_ARR = []
const isArray = Array.isArray

export const h = function (tag, props) {
  for (var vnode, rest = [], children = [], i = arguments.length; i-- > 2;) {
    rest.push(arguments[i])
  }

  while (rest.length > 0) {
    if (isArray((vnode = rest.pop()))) {
      for (var i = vnode.length; i-- > 0;) {
        rest.push(vnode[i])
      }
    } else if (vnode === false || vnode === true || vnode == null) {
    } else {
      children.push(typeof vnode === "object" ? vnode : createTextVNode(vnode))
    }
  }

  props = props || EMPTY_OBJ

  return typeof tag === "function"
    ? tag(props, children)
    : createVNode(tag, props, children, props.key)
}

const createTextVNode = function (value) {
  return createVNode(value, EMPTY_OBJ, EMPTY_ARR, null, TEXT_NODE)
}

const createVNode = function (tag, props, children, key, type) {
  return {
    tag,
    props,
    children,
    type,
    key
  }
}