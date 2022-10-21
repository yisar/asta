// 这里的实现并不好，正确应该是生成线性的结构

export const s = {
    openTag(tag, attrs) {
        let code = ''
        code += `<${tag}`
        for (const name in attrs) {
            let value = attrs[name]
            if (typeof attrs[name] === 'object') {
                value = Object.values(attrs[name])[0].toString().replace(/[\s]/g, '')
            }
            code += ` ${name}="${value || ''}"`
        }
        code += '>'
        return code
    },
    closeTag(tag) {
        return `</${tag}>`
    },
    expression(content) {
        if (typeof content === 'string' || typeof content === 'number') {
            return content.toString()
        } else if (Array.isArray(content)) {
            return content.join('')
        } else {
            return ''
        }
    },
    component(comp, attrs){
        let props = {}
        for (const name in attrs) {
            let value = attrs[name]
            if (typeof attrs[name] === 'object') {
                value = Object.values(attrs[name])[0]
            }
            props[name] = value
        }
        return comp(props)
    },
    empty(){
        return ''
    }
}

