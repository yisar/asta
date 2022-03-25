import { asta } from './runtime.js'

asta({
    count: 0,
    add: function () {
		this.count++
	},
    tag: 'my-counter',
    view: `<div>{count}</div><button @click="add">+</button>`
})