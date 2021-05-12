# Asta

Simple compiler for web component

### Use

```js
import { asta } from 'asta'

asta({
    tag: 'my-counter',
    count: 0,
    add(){
        this.count++
        this.update()
    },
    view: `<div>{count}</div><button @click="add">+</button>`
})
```
