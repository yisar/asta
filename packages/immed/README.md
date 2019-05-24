## immed

> 一个极小的 mutable 劫持方案，通过抽象 patch 用于 immutable 环境

### 原理

在 Proxy 劫持过程中产生 patches，在 react 环境中集中处理 patches

#### immed vs immer

immer 的方案是，通过将传入的对象深拷贝，达到不可变的目的，用于 react 看似靠谱

但是它和 state 高度脱离，拿到的 draft 对象不再是普通的对象，而是 Proxy 实例

加上深拷贝的性能问题，导致它不得不做一些优化手段

immed 多了一层 patches 的抽象，我们无需关心，对象是否可变，我们只要拿到 pathes ，集中对 react 的 state 处理即可

### Use

```js
var obj = { name: 132, age: 20 }
var proxy = new Immed(obj)
var state = proxy.getState()
state.name = 'yse'
console.log(state) // state { name: 'yse', age: 20 }
```

以上，可以看到，state 是可变的，我们不用去拷贝它，它爱变不变

因为我们只需要拿到 pathes ：

```js
var patches = proxy.getPatches()
console.log(patches) // patches [{op: "replace", path: "/name", value: "yse"}]
```

当我们拿到 patches 后，我们就可以对 state 进行处理了

```js
let state = { name: 132, age: 20 }
let patces = [{ op: 'replace', path: '/name', value: 'yse' }]
pathches.forEach({op,path,value} => {
  switch (op) {
    case 'replace':
      delve(state, path, value)
      break
  }
})
```

如果我们能够事先给组件绑定 path 的话，甚至可以做 path 的匹配命中工作
```js
let path = '/name'
patches.filter((item=>item.path===path)).forEach(/*……*/)
```
