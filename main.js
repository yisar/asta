import { createApp } from './runtime.js'

createApp({
    node: document.body,
    count: 0,
    add(){
        console.log(123)
        this.count++
        this.update()
    },
    view: `<div @click="add">{count}</div>`
})