## immed

> 一个极小的劫持方案，同时解决 Immutable 的问题

### 原理

Ⅰ 默认使用 Proxy 进行劫持，get 的时候进行递归，是按需递归，嵌套越浅，访问越深，性能越好

#### immed vs immer

默认情况下，immer 性能更好，因为它内部做了很多优化

但是 smox 会结合 path-updating 机制，immed 会做到最小劫持，接近原生对象的性能

本着追求性价比（性能很好但不是最好，代码量却是最小）的原则，我写了这个库，建议结合 path-updating 一起使用

### Use

```javascript
let sate = {
  boy: {
    love: {
      boy: true
    }
  }
}
produce(state, draft => {
  draft.boy.love.boy = false
  console.log(draft.boy.love.boy) //false
  console.log(state.boy.love.boy) //true
})
```

第三个参数是 path，可选传入，能够根据 path 寻找最小劫持距离

```javascript
produce(state, fn, ['boy', 'love', 'boy'])
```

同时，immed 为了凑字数，还提供了时间切片的双向绑定功能

只需要在你的 dom 结构中加上 v-model 属性

```
