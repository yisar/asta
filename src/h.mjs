const TEXT_NODE = 3
const EMPTY_OBJ = {}
const EMPTY_ARR = []
const isArray = Array.isArray

let simpleNode = '';

export const h = function (tag, props, ...args) {
  let children = []
  props = props || EMPTY_OBJ


  let key = props.key || null

  for (let i = 0; i < args.length; i++) {
    let vnode = args[i]
    const isEnd = i === args.length - 1;

    if (isArray(vnode)) {
      children.push(...vnode)
    } else if (vnode === false || vnode === true || vnode == null) {
      vnode = ''
    } else {
      const isStrNode = isStr(vnode);
      // merge simple nodes
      if (isStrNode) {
        simpleNode += String(vnode);
      }

      if (simpleNode && (!isStrNode || isEnd)) {
        children.push(createText(simpleNode));
        simpleNode = '';
      }

      if (!isStrNode) {
        children.push(vnode)
      }

    }
  }

  props.key = undefined;
  return typeof tag === "function"
    ? tag(props, children)
    : createVNode(tag, props, children, key)
}

const createText = function (value) {
  return createVNode(value, EMPTY_OBJ, EMPTY_ARR, null, TEXT_NODE)
}

const isStr = x => typeof x === 'string' || typeof x === 'number'

const createVNode = function (tag, props, children, key, type) {
  return {
    tag,
    props,
    children,
    type,
    key
  }
}