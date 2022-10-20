const TEXT_NODE = 3
const EMPTY_OBJ = {}
const EMPTY_ARR = []
const isArray = Array.isArray

export const h = function (tag, props, ...args) {
  let children = []
  let key = props.key

  for (let i = 0; i < props.children.length; i++) {
    let vnode = props.children[i]
    if (vnode === false || vnode === true || vnode == null) {
    } else {
      children.push(typeof vnode === "object" ? vnode : createTextVNode(vnode))
    }
  }

  props.key = undefined;
  
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