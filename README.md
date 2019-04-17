<img align="right" height="150" src="https://ws1.sinaimg.cn/large/0065Zy9egy1fyuqe61tlej30b40b4gn6.jpg" />

# Smox

_tiny but perfect state management_

[![](https://img.shields.io/npm/v/smox.svg?style=flat)](https://npmjs.com/package/smox)
[![](https://img.shields.io/npm/dm/smox.svg?style=flat)](https://npmjs.com/package/smox)
[![](https://img.shields.io/bundlephobia/minzip/smox.svg?style=flat)](https://bundlephobia.com/result?p=smox)

### Feature

:pig_nose: New Context Api、path updating、Es6 proxy、nested ……

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
  count: 0,
}

const actions = {
  up(state) {
    state.count++
  },
  down(state) {
    state.count--
  },
}

const effects = {
  async upAsync(actions) {
    await new Promise(t => setTimeout(t, 1000))
    actions.up()
  },
}

const store = new Smox({ state, actions, effects })
```

以上，smox 的部分就结束啦，创建了一个 store


### Nested

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
```

以上，smox 最基本的机制就搞定了，接下来看看如何用于 react——

## React

在阅读下面内容之前，需要理解晓得 smox 有个 path 机制

path 机制通俗的来讲，就是，给定一个 path，然后通过 path 去匹配全局 store 的局部 state 和 方法

react 没办法自动生成 path，只能手动给，往下看——

#### Provider

不管怎样，由于 smox 使用了 new Context API，所以首先需要使用 provier 来生产整个 store

```JavaScript
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

然后，子组件，smox 分别提供了三种不同的方式来使用 path

#### render props

render props 的方式是最为简洁的，需要使用 smox 提供的 Path 组件，它和 Consumer 类似，本质是 render children，to 接受 path 参数

```javascript
import { Path } from 'smox'

class App extends React.Component {
  render() {
    return (
      <Path to="counter/count">
        {({ state, actions, effects }) => (
          <>
            <div>{state.count}</div>
            <button onClick={() => actions.up()}>+</button>
            <button onClick={() => effects.upAsync()}>x</button>
          </>
        )}
      </Path>
    )
  }
}
```

#### HOC

smox 还提供了 HOC 的封装，path（小写） 这个 API 和 redux 的 connect 类似，同样接受一个字符串的 path

```javascript
import { path } from 'smox'

@path('counter/count')
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
```

#### Hooks API

smox 提供 hooks 支持，它的 API 无比简单，使用 usePath ，参数一致

```javascript
import React from 'react'
import { useStore } from 'smox'

function App() {
  const { state, actions, effects } = usePath('counter/count')

  return (
    <>
      <div>{state.count}</div>
      <button onClick={() => actions.up()}>+</button>
      <button onClick={() => effects.upAsync()}>x</button>
    </>
  )
}
```

### Proxy、async/await

Proxy、async/await 可以使得 actions 代码同步，更好看

```javascript
const actions = {
  up(state) {
    state.count += 1
    state.count += 2
  },
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

immed 是 smox 内部的一个子包，它和 immer 类似，但是和 path 结合使用，性能更好

```javascript
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

### 魔法字符串

最后，很多人觉得 path 的魔法字符串的问题比较绝望，如果不传 path 的话，默认将会把整个 store

性能可能会有影响，但是如果确实需要，不妨试试魔法解构(⊙o⊙)…

```javascript
const {coutner:{count}} = usePath()
```

## Demo

- [Counter](https://github.com/132yse/smox/tree/master/examples/counter)

### License

MIT
