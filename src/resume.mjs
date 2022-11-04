import { $import } from './$import.mjs'

const events = ['click', 'keydown', 'input', 'mousedown', 'mouseover', 'mouseenter', 'blur', 'focus', 'dbclick', 'wheel', 'change', 'touchstart', 'touchmove', 'touchend', 'drag']

for (const event of events) {
	document.addEventListener(event, (e) => {
		const target = e.target
		if (target) {
			$import(target.getAttribute('$on' + event), e)
		}
	})
}

export function resume(root) {
	window.dispatch = (newState) => {
		window.__state = { ...window.__state, ...newState }
		import('./app.js').then((mod) => {
			const vdom = mod.default(window.__state)
			patch(root, root.firstChild, vdom)
		})
	}
}

var getKey = (vdom) => {
	return vdom == null ? vdom : vdom.getAttribute ? vdom.getAttribute('key') : vdom.key
}

function patch(parent, node, vnode) {
	if (vnode.type === 3 && node.nodeType === 3) {
		if (node.nodeValue !== vnode.tag) {
			node.nodeValue = vnode.tag
		}
	} else if (node == null || node.nodeName.toLowerCase() !== vnode.tag) {
		parent.insertBefore(createNode(vnode))
		if (node != null) {
			parent.removeChild(node)
		}
	} else {
		let oldHead = 0,
			newHead = 0,
			oldKids = node.childNodes,
			newKids = vnode.children,
			oldTail = oldKids.length - 1,
			newTail = newKids.length - 1,
			oldKey

		updateNode(node, vnode)

		while (newHead <= newTail && oldHead <= oldTail) {
			if ((oldKey = getKey(oldKids[oldHead]) == null || oldKey !== getKey(newKids[newHead]))) {
				break
			}
			patch(node, oldKids[oldHead++], newKids[newHead++])
		}

		while (newHead <= newTail && oldHead <= oldTail) {
			if ((oldKey = getKey(oldKids[oldTail]) == null || oldKey !== getKey(newKids[newTail]))) {
				break
			}
			patch(node, oldKids[oldTail--], newKids[newTail--])
		}

		if (oldHead > oldTail) {
			while (newHead <= newTail) {
				node.insertBefore(createNode(newKids[newHead++]), oldKids[oldHead])
			}
		} else if (newHead > newTail) {
			while (oldHead <= oldTail) {
				node.removeChild(oldKids[oldHead++])
			}
		} else {
			for (var keyed = {}, newKeyed = {}, i = oldHead; i <= oldTail; i++) {
				if (oldKids[i].key != null) {
					keyed[oldKids[i].key] = oldKids[i]
				}
			}
			while (newHead <= newTail) {
				let oldKey = getKey(oldKids[oldHead])
				let newKey = getKey(newKids[newHead])

				if (newKeyed[oldKey] || (newKey != null && newKey === getKey(oldKids[oldHead + 1]))) {
					if (oldKey == null) {
						node.removeChild(oldKids[oldHead])
					}
					oldHead++
					continue
				}

				if (newKey == null) {
					if (oldKey == null) {
						patch(node, oldKids[oldHead], newKids[newHead])
						newHead++
					}
					oldHead++
				} else {
					if (oldKey === newKey) {
						patch(node, oldKids[oldHead], newKids[newHead])
						newKeyed[newKey] = true
						oldHead++
					} else {
						if (keyed[newKey] != null) {
							patch(node, node.insertBefore(keyed[newKey], oldKids[oldHead]), newKids[newHead])
							newKeyed[newKey] = true
						} else {
							patch(node, oldKids[oldHead], newKids[newHead])
						}
					}
					newHead++
				}
			}

			while (oldHead <= oldTail) {
				if (getKey(oldKids[oldHead++]) == null) {
					node.removeChild(oldKids[oldHead])
				}
			}

			for (const i in keyed) {
				if (newKeyed[i] == null) {
					node.removeChild(keyed[i])
				}
			}
		}
	}
}

function updateNode(node, vnode) {
	for (const name in vnode.props) {
		// need diff
		if (name[0] === '$' || name === 'key') continue
		if (!(name in node.attributes) || node.getAttribute(name) !== vnode.props[name]) {
			if (name in node) {
				node[name] = vnode.props[name]
			} else {
				node.setAttribute(name, vnode.props[name])
			}
		}
	}
}

function createNode(vdom) {
	const dom = vdom.type === 3 ? document.createTextNode('') : document.createElement(vdom.tag)

	for (var i = 0; i < vdom.children.length; i++) {
		dom.appendChild(createNode(vdom.children[i]))
	}
	return dom
}
