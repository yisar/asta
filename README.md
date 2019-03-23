<img align="right" height="150" src="https://ws1.sinaimg.cn/large/0065Zy9egy1fyuqe61tlej30b40b4gn6.jpg" />

# Smox

_tiny but perfect state management_

[![](https://img.shields.io/npm/v/smox.svg?style=flat)](https://npmjs.com/package/smox)
[![](https://img.shields.io/npm/dm/smox.svg?style=flat)](https://npmjs.com/package/smox)
[![](https://img.shields.io/bundlephobia/minzip/smox.svg?style=flat)](https://bundlephobia.com/result?p=smox)

### Feature

:pig_nose: New Context Api、path updating、Es6 proxy、nexted ……

:jack_o_lantern: Tiny size, 1Kb gzipped, no Dependencies

## Install

```shell
npm i smox -S
```

## Use

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import { Store } from 'smox'

const state = {
  count: 0
}

const actions = {
  up(state) {
    state.count++
  },
  down(state) {
    state.count--
  }
}

const effects = {
  async upAsync(actions) {
    await new Promise(t => setTimeout(t, 1000))
    actions.up()
  }
}

const store = new Store({ state, actions, effects })
```
以上，smox 的部分就结束啦，创建了一个 store

然后就是如何用于 react：

#### Class

用于 class，需要使用 Provider 和 map，它和 vuex 的 mapXxx 类似，传递魔法字符串

```javascript
import React from 'react'
import { map } from 'smox'

@map({
  state: ['count'],
  actions: ['up', 'down'],
  effects: ['upAsync']
})
class App extends React.Component {
  render() {
    return (
      <>
        <h1>现在是{this.props.count}</h1>
        <button onClick={this.props.up}>加一</button>
        <button onClick={this.props.down}>减一</button>
        <button onClick={this.props.upAsync}>异步加一</button>
      </>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

#### Hooks API
值得一提，smox 是个中心化 store，而官方的 useReduer 是允许 use 多次，多个多个不同的 reducer 的

smox 的 useStore 不要这样做，仍然要坚持 单 store 的原则，store 全局 new 一次，每个组件只 use 一次

```javascript
import React from 'react'
import { useStore } from 'smox'

function App () {
  const { state, actions, effects } = useStore(store)

  return (
    <>
      <div>{state.count}</div>
      <button onClick={() => actions.up()}>+</button>
      <button onClick={() => effects.upAsync()}>x</button>
    </>
  )
}
```
hooks API 解决了魔法字符串的问题，但是如果 store 嵌套过深

不妨试试魔法解构(⊙o⊙)…

```javascript
const {sex,{coutner:{count}}} = useStore({state})
```

### Nexted

nexted 是 smox 的 store 划分机制，它会根据嵌套对象的 key 作为 path，然后根据 path 来限定作用域，命中局部的状态和方法，如下：

```Javascript
const state = {
  counter:{
    count: 0
  }
}

const actions = {
  counter: {
    up(state, data) { //此处的 state 为同路径的 { count:0 }
      state.count += data
    },
    down(state, data) {
      state.count -= data
    }
  }
}

const effects = {
  counter: {
    async upAsync(actions) { //此处的 actions 为同路径的 { up(), down() }
      await new Promise(t => setTimeout(t, 1000))
      actions.up()
    }
  }
}

@map({
  state:['counter/count'],
  actions:['counter/up','counter/down'],
  effects:['counter/upAsync']
})
```

### Proxy、async/await

Proxy 可以使得 action 代码同步，更好看

```javascript
const actions = {
  up(state) {
    state.count += 1
    state.count += 2
  }
}
```
使用这个 [polyfill](https://github.com/GoogleChrome/proxy-polyfill) 可以兼容 ie9+

同时 effects 下面，配合 async/await，也能同步的编写逻辑

```JavaScript
const effects = {
  async upAsync(actions) {
    await new Promise(t => setTimeout(t, 1000))
    actions.up()
    actions.down()
  }
}
```

### Immed

if you only SetState , there is also a `produce` API turn to immutable easy

```javascript
import React from 'react'
import { produce } from 'smox'

class App extends React.Component {
  onClick = () => {
    this.setState(
      produce(this.state, draft => {
        draft.count++
      })
    )
  }
}

export default App
```

## Demo

- [Counter](https://github.com/132yse/smox/tree/master/examples/counter)

### License

MIT
