export class AstaBase extends HTMLElement {
    constructor() {
        super()
        this.name = ''
        this.queued = false
        // 定义时即编译为指令 
        this.view = []
        // 数据和事件上下文存于core属性 
        this.core = {}
        this.props = {}
        this.root = this.attachShadow({ mode: 'open' })

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
                this.emit('update', "组件update")
            }, 0)
        }
    }
    emit(type, data) {
        var event = new CustomEvent(type, {
            detail: data,
            bubbles: false,  // 设置为true,冒泡！  false,则只触发到自定义元素，更合理。
            composed: true  // 设置为可穿透组件
        });
        this.root.dispatchEvent(event);
    }

    connectedCallback() {
        this.view[0](this.shadowRoot)
        this.emit('create', "组件已create and mounted")
    }
    disconnectedCallback() {
        this.view[2]()
        this.emit('destroy', "组件  destory")
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`变化的属性:${name},值 ${oldValue}=>${newValue}`)
        this.props[name] = newValue;
        this.update()
    }
}