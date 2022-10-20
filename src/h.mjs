const TEXT_NODE = 3
const EMPTY_OBJ = {}
const EMPTY_ARR = []
const isArray = Array.isArray

export const h = function (tag, props, ...args) {
  let children = []
  props = props || EMPTY_OBJ

  let key = props.key || null

  for (let i = 0; i < args.length; i++) {
    let vnode = args[i]
    if (isArray(vnode)) {
      for (var j = vnode.length; i-- > 0;) {
        args.push(vnode[j])
      }
    } else if (vnode === false || vnode === true || vnode == null) {
    } else {
      children.push(typeof vnode === "object" ? vnode : createTextVNode(vnode))
    }
  }

  props.key = undefined;
  return typeof tag === "function"
    ? tag(props, children)
    : createVNode(tag, props, children, key)
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