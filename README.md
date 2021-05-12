# Asta

Simple compiler for web component

### Use

```js
import { asta } from 'asta'

asta({
    node: document.body,
    count: 0,
    add(){
        this.count++
        this.update()
    },
    view: `<div>{count}</div><button @click="add">+</button>`
})
```
