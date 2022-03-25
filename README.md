# Asta

Simple compiler for web component

### Use

```js
import { asta } from 'asta'

asta({
	count: 0,
	add: function () {
		this.count++
	},
	tag: 'my-counter',
	view: `<div>{count}</div><button @click="add">+</button>`,
})
```
