export class AstaBase extends HTMLElement {
    constructor() {
        super()
        this.name = ''
        this.queued = false
        this.events = {}
        // 定义时即编译为指令 
        this.view = []
        // 数据和事件上下文存于core属性 
        this.core = {}
        this.props = {}
        this.attachShadow({ mode: 'open' })
    }
    /**  触发更新视图. 当传入key时，先更新值，后更新视图 
     *  @param {} key 可选 
     *  @param {} value 
     * */
    update(key, value) {
        let that = this
        if (key != null) {
            if (typeof key === 'object') {
                for (let kidKey in key) {
                    that.core[kidKey] = key[kidKey]
                }
            } else { this.core[key] = value }
        }

        if (this.queued === false) {
            this.queued = true
            setTimeout(() => {
                this.view[1]()
                this.queued = false
                this.emit('onUpdate', "组件  up")
            }, 0)
        }
    }

    on(type, handler) {
        let handlers = this.events[type]
        // 不存在则添加
        if (!handlers) {
            this.events[type] = [handler] //? 是否 .bind(this)
        } else {
            handlers.push(handler)
        }
    }
    off(type, handler) {
        if (!type) {
            // eg.  this.off()
            this.events = {}
        } else if (!handler) {
            // eg.  this.off("onCreate")
            this.events[type] = []
        } else {
            this.events[type] = this.events[type].filter((h) => h != handler)
        }
    }
    emit(type, data) {
        const handlers = this.events[type]
        if (handlers instanceof Array) {
            handlers.forEach((h) => h(data))
        }
    }

    connectedCallback() {
        this.view[0](this.shadowRoot)
        this.emit('onCreate', "组件  cm")
    }
    disconnectedCallback() {
        this.view[2]()
        this.emit('onDestroy', "组件  destory")
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`变化的属性:${name},值 ${oldValue}=>${newValue}`)
        this.props[name] = newValue;
        this.update()
    }
}