import { parse } from './parse.js'
import { generate } from './generate.js'
import { AstaBase } from "./astaBase.js"
/**
* 构造一个自定义组件
* @param {*} core 组件内的appCore
* @param {*} options 组件的视图，生命周期事件等 
*/
export function asta(coreFn, options) {
    let tag = options.tag
    // 立即定义一个类 
    class Asta extends AstaBase {
        static get tag() { return tag }
        static get observedAttributes() { return options.props; }
        constructor() {
            super()
            this.name = tag
            // 定义时即编译为指令 
            let viewBody = generate(parse(options.view), null)
            this.view = new Function('a', 'instance', 'locals', viewBody)(a, this, {})
            console.log(viewBody)
             let that = this;
            this.core = coreFn()
            for (let key in coreFn()) {
                let fn = this.core[key]
                if (typeof fn === 'function') {
                    this.core[key] = function (...args) {
                        fn.apply(that, args) //? 测试用call or apply 
                        that.update();
                    }
                }
            }
            for (let key in options.props) {
                this.props[key] = ""
            }
            
            if(options.style){
                let style=document.createElement("style")
                style.appendChild(document.createTextNode(options.style));
                this.root.appendChild(style);
            }
        }
    }
    const hasDef = window.customElements.get(tag)
    if (!hasDef) {
        customElements.define(tag, Asta)
        document.body.querySelectorAll(tag).forEach(el => {
            customElements.upgrade(el)
        })
    } else {
        console.error(tag + "组件已经定义")
    }
    return Asta
}
const createElement = function (type) { return document.createElement(type); };
const createTextNode = function (content) { return document.createTextNode(content); };
const createComment = function () { return document.createComment(""); };
const setAttribute = function (element, key, value) { element.setAttribute(key, value); };
const addEventListener = function (element, type, handler) { element.addEventListener(type, handler); };
const setTextContent = function (element, content) { element.textContent = content; };
const appendChild = function (element, parent) { parent.appendChild(element); };
const removeChild = function (element, parent) { parent.removeChild(element); };
const insertBefore = function (element, reference, parent) { parent.insertBefore(element, reference); }
const a = {
    c: {},
    ce: createElement,
    ctn: createTextNode,
    cc: createComment,
    sa: setAttribute,
    ael: addEventListener,
    stc: setTextContent,
    ac: appendChild,
    rc: removeChild,
    ib: insertBefore,
}