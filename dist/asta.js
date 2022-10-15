const events = ['click']
function parseURLParams(url) {
    let queryParams = {}
    let reg = /([^?=&]+)=([^?=&]+)/g
    url.replace(reg, function () {
        queryParams[arguments[1]] = arguments[2]
    })
    return queryParams
}
function $import(url, e) {
    const { fn } = parseURLParams(url)
    import(url).then(mod => {
        const newState = mod[fn](window.__state, e)
        window.dispatch(newState)
    })
}

for (const event of events) {
    document.addEventListener(event, e => {
        const target = e.target.closest('.a');
        if (target) {
            $import(target.getAttribute('$on' + event), e)

        }
    })
}

function resume(root) {
    window.dispatch = (newState) => {
        window.__state = { ...window.__state, ...newState }
        import('./app.mjs').then(mod=>{
            console.log(mod)
            patch(root, mod.view(window.__state), root.firstChild, 0)
        }) 
    }

}

function patch(parent, node, oldNode, index) {
    if (node.type === 3 && oldNode.nodeType === 3) {
        oldNode.nodeValue = node.tag
    }
    else if (oldNode === undefined) {
        parent.appendChild(createElement(node))

    } else if (node === undefined) {
        while (index > 0 && !parent.childNodes[index]) {
            index--
        }
        var element = parent.childNodes[index]
        if (oldNode && oldNode.data) {
            var hook = oldNode.data.onremove
            if (hook) {
                defer(hook, element)
            }
        }

        parent.removeChild(element)

    } else if (oldNode.nodeName.toLowerCase() !== node.tag) {
        parent.replaceChild(createElement(node), parent.childNodes[index])

    } else if (node.tag) {
        var element = parent.childNodes[index]

        updateElement(element, node.props)

        var len = node.children.length, oldLen = oldNode.children.length

        for (var i = 0; i < len || i < oldLen; i++) {
            patch(element, node.children[i], oldNode.childNodes[i], i)
        }
    }
}

function updateElement(oldNode, data) {
    for (const name in data) {
        if (oldNode[name] && oldNode[name] !== data[name]) {
            // oldNode[name] = data[name]
        } else if (oldNode.getAttribute(name) && oldNode.getAttribute(name) !== data[name]) {
            // oldNode.setAttribute(name, data[name])
        } else {
            // oldNode.removeAttribute(name)
        }
    }
}

function createElement(vdom) {
    const dom =
        vdom.type === 3
            ? document.createTextNode('')
            : document.createElement(vdom.tag)

    for (var i = 0; i < vdom.children.length; i++) {
        dom.appendChild(
            createElement(
                vdom.children[i]
            )
        )
    }
    return (vdom.node = dom)
}

resume(document.body)