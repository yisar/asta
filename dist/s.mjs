// 这里的实现并不好，正确应该是生成线性的结构

export const s = {
    openTag(tag, attrs) {
        let code = ''
        code += `<${tag}`
        for (const attr in attrs) {
            code += ` ${attr}=${attrs[attr]}`
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

