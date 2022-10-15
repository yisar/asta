const cache = new Map();
const uppercasePattern = /([A-Z])/g;
const msPattern = /^ms-/;

// https://www.w3.org/TR/html/syntax.html#void-elements
const voidElements = new Set([
    'area',
    'base',
    'br',
    'col',
    'embed',
    'hr',
    'img',
    'input',
    'link',
    'meta',
    'param',
    'source',
    'track',
    'wbr',
]);


// "backgroundColor" => "background-color"
// "MozTransition" => "-moz-transition"
// "msTransition" => "-ms-transition"
function hyphenateStyleName(styleName) {
    if (!cache.has(styleName)) {
        cache.set(styleName, styleName
            .replace(uppercasePattern, '-$&')
            .toLowerCase()
            .replace(msPattern, '-ms-'));
    }
    return cache.get(styleName);
}

function stringifyStyles(styles) {
    let serialized = '';
    let delimiter = '';
    const styleNames = Object.keys(styles);
    for (let i = 0, len = styleNames.length; i < len; i++) {
        const styleName = styleNames[i];
        const styleValue = styles[styleName];

        // keep in sync with https://github.com/hyperapp/hyperapp/blob/1.0.2/src/index.js#L134
        if (styleValue != null) {
            serialized += delimiter + hyphenateStyleName(styleName) + ':' + styleValue;
            delimiter = ';';
        }
    }
    return serialized || null;
}

function renderAttribute(name, value) {
    let val = value;
    if (name === 'style' && val) {
        val = stringifyStyles(val);
    }
    if (val == null || val === false) {
        return '';
    }
    if (val === true) {
        return name;
    }
    return name + '="' + val + '"';
}

function renderFragment(node, stack) {
    if (node == null) {
        return '';
    }

    const props = node.props;
    if (node.type === 3) { // text node
        return node.tag;
    }

    const tag = node.tag;
    let out = '';
    let footer = '';
    if (tag) {
        out += '<' + tag;
        const propNames = Object.keys(props);
        for (let i = 0, len = propNames.length; i < len; i++) {
            const name = propNames[i];
            const value = props[name];
            if (name !== 'key' && name !== 'innerHTML' && typeof value !== 'function') {
                const attr = renderAttribute(name, value);
                if (attr) {
                    out += ' ' + attr;
                }
            }
        }

        if (voidElements.has(tag)) {
            out += '/>';
        } else {
            out += '>';
            footer = '</' + tag + '>';
        }
    }

    const html = props.innerHTML;
    if (html != null) {
        out += html;
    }

    const children = node.children;
    if (children.length > 0) {
        stack.push({
            childIndex: 0,
            children,
            footer,
        });
    } else {
        out += footer;
    }

    return out;
}

export function renderer(node) {
    const stack = [{
        childIndex: 0,
        children: [node],
        footer: '',
    }];
    let end = false;
    return (bytes) => {
        if (end) {
            return null;
        }
        let out = '';
        while (out.length < bytes) {
            if (stack.length === 0) {
                end = true;
                break;
            }
            const frame = stack[stack.length - 1];
            if (frame.childIndex >= frame.children.length) {
                out += frame.footer;
                stack.pop();
            } else {
                const child = frame.children[frame.childIndex++];
                out += renderFragment(child, stack);
            }
        }
        return out;
    };
}

export function renderToString(node) {
    return renderer(node)(Infinity);
}