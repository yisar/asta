import { asta } from './runtime.js'

asta({
    tag: 'my-counter',
    count: 0,
    add(){
        this.count++
        this.update()
    },
    view: `<div>{count}</div><button @click="add">+</button>`
})