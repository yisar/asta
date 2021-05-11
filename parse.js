const whitespaceRE = /^\s+$/
const valueEndRE = /[\s/>]/
const expressionRE = /"[^"]*"|'[^']*'|\d+[a-zA-Z$_]\w*|\.[a-zA-Z$_]\w*|[a-zA-Z$_]\w*:|([a-zA-Z$_]\w*)/g;
const globals = "NaN false in null this true typeof undefined"
const escapeRE = /(?:(?:&(?:amp|gt|lt|nbsp|quot);)|"|\\|\n)/g
const escapeMap = {
    "&amp;": "&",
    "&gt;": ">",
    "&lt;": "<",
    "&nbsp;": " ",
    "&quot;": '\\"',
    "\\": "\\\\",
    '"': '\\"',
    "\n": "\\n",
}

export const parse = input => {
    const length = input.length
    let root = {
        element: 0,
        next: 1,
        type: 'root',
        attributes: [],
        children: []
    }
    let stack = [root]

    for (let i = 0; i < length;) {
        let char = input[i]
        if (char === '<') {
            if (input[i + 1] === '!' && input[i + 2] === '-' && input[i + 3] === '-') {
                i = parseComment(i + 4, input, length)
            } else if (input[i + 1] === '/') {
                i = parseCloseTag(i + 2, input, length, stack)
            } else {
                i = parseOpenTag(i + 1, input, length, stack)
            }
        } else if (char === '{') {
            i = parseExpression(i + 1, input, length, stack)
        } else {
            i = parseText(i, input, length, stack)
        }
    }
    return root
}

const parseComment = (index, input, length) => {
    while (index < length) {
        let char0 = input[index]
        let char1 = input[index + 1]
        let char2 = input[index + 2]
        let char3 = input[index + 3]

        if (char0 === '<' && char1 === '!' && char2 === '-' && char3 === '-') {
            index = parseComment(index + 4, input, length)
        } else if (char0 === '-' && char1 === '-' && char2 === '>') {
            index += 3
            break
        } else {
            index += 1
        }
    }
    return index
}

const parseCloseTag = (index, input, length, stack) => {
    let type = ''
    for (; index < length; index++) {
        let char = input[index]
        if (char === '>') {
            index += 1
            break
        } else {
            type += char
        }
    }
    let lastElement = stack.pop()
    if (type !== lastElement.type) {
        throw new Error(`unclosed tag: ${lastElement.type}`)
    }
    return index
}

const parseOpenTag = (index, input, length, stack) => {
    let element = {
        type: '',
        attributes: [],
        children: []
    }

    while (index < length) {
        let char = input[index]
        if (char === '/' || char === '>') {
            let attributes = element.attributes
            let lastIndex = stack.length - 1
            console.log(lastIndex)
            if (char === '/') {
                index += 1
            } else {
                stack.push(element)
            }

            for (let i = 0; i < attributes.length;) {
                let attribute = attributes[i]
                if (isComponent(attribute.name)) {
                    element = {
                        type: attribute.name,
                        attributes: [{
                            name: '',
                            value: attribute.value,
                            expression: attribute.expression,
                            dynamic: attribute.dynamic
                        }],
                        children: [element]
                    }
                    attributes.slice(i, 1)
                } else {
                    i += 1
                }
            }
            stack[lastIndex].children.push(element)
            index += 1
            break
        } else if ((whitespaceRE.test(char) && (index += 1)) || char === '=') {
            index = parseAttributes(index, input, length, element.attributes)
        } else {
            element.type += char
            index += 1
        }
    }
    return index
}

const parseAttributes = (index, input, length, attributes) => {
    while (index < length) {
        let char = input[index]
        if (char === '/' || char === '>') {
            break
        } else if (whitespaceRE.test(char)) {
            index += 1
            continue
        } else {
            let name = ''
            let value = void 0
            let expression = false

            while (index < length) {
                char = input[index]
                if (char === '/' || char === '>' || whitespaceRE.test(char)) {
                    value = ''
                    break
                } else if (char === '=') {
                    index += 1
                    break
                } else {
                    name += char
                    index += 1
                }
            }

            if (value === undefined) {
                let quote = void 0
                value = ''
                char = input[index]

                if (char === '"' || char === "'") {
                    quote = char
                    index += 1
                } else if (char === '{') {
                    quote = '}'
                    expression = true
                    quote = valueEndRE
                }

                while (index < length) {
                    char = input[index]
                    if ((typeof quote === 'object' && quote.test(char)) || char === quote) {
                        index += 1
                        break
                    } else {
                        value += char
                        index += 1
                    }
                }
            }
            let dynamic = false
            if (expression) {
                let template = parseTemplate(value)
                value = template.expression
                dynamic = template.dynamic
            }

            attributes.push({
                name, value, expression, dynamic
            })
        }
    }
    return index
}

const parseTemplate = expression => {
    let dynamic = false
    expression = expression.replace(expressionRE, (match, name) => {
        if (name === undefined || globals.indexOf(name) > -1) {
            return match
        } else {
            dynamic = true
            if (name[0] === '$') {
                return `locals.${name}`
            } else {
                return `ctx.${name}`
            }
        }
    })
    return { expression, dynamic }
}

const parseExpression = (index, input, length, stack) => {
    let expression = ''
    for (; index < length; index++) {
        let char = input[index]
        if (char === '}') {
            index += 1
            break
        } else {
            expression += char
        }
    }
    let template = parseTemplate(expression)
    stack[stack.length - 1].children.push({
        type: 'text',
        attributes: [{
            name: '',
            value: template.expression,
            expression: true,
            dynamic: template.dynamic
        }],
        children: []
    })
    return index
}

const parseText = (index, input, length, stack) => {
    let content = ''
    for (; index < length; index++) {
        let char = input[index]
        if (char === '<' || char === '{') {
            break
        } else {
            content += char
        }
    }
    if (!whitespaceRE.test(content)) {
        stack[stack.length - 1].children.push({
            type: 'text',
            attributes: [{
                name: 'nodeValue',
                value: content.replace(escapeRE, match => escapeMap[match]),
                expression: false,
                dynamic: false
            }],
            children: []

        })
    }
    return index
}

export const isComponent = type => type[0] === type[0].toUpperCase() && type[0] !== type[0].toLowerCase()