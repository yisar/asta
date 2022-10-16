// 这里的实现并不好，正确应该是生成线性的结构

export const s = {
    openTag(tag, attrs) {
        let code = ''
        code += `<${tag}`
        for (const name in attrs) {
            let value = attrs[name]
            if(name[0] === '$'){
                value = Object.values(attrs[name])[0]
            }
            code += ` ${name}="${value}"`
        }
        code += '>'
        return code
    },
    closeTag(tag) {
        return `</${tag}>`
    },
    text(str) {
        return str.toString()
    }
}

