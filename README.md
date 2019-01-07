<img align="right" height="200" src="https://ws1.sinaimg.cn/large/0065Zy9egy1fyuqe61tlej30b40b4gn6.jpg" />

# Smox 
> Fast 1kB state management based on nexed-proxy.

[![NPM version](https://img.shields.io/npm/v/smox.svg?style=flat-square)](https://npmjs.com/package/smox) 
[![NPM downloads](https://img.shields.io/npm/dm/smox.svg?style=flat-square)](https://npmjs.com/package/smox)


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
import { Store, Provider } from 'smox'

const state = {
  count: 2
}

const actions = {
  up(state, data) {
    state.count += data
  },
  down(state, data) {
    state.count -= data
  }
}

const effects = {
  async upAsync(actions, data) {
    await new Promise(t => setTimeout(t, 1000))
    actions.up(data)
  }
}

const store = new Store({ state, actions, effects })

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

```javascript
import React from 'react'
import { map } from 'smox'

@map({
  state: ['count'],
  actions: ['up','down'],
  effects:['upAsync']
})
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>现在是{this.props.count}</h1>
        <button onClick={this.props.up}>加一</button>
        <button onClick={this.props.down}>减一</button>
        <button onClick={this.props.upAsync}>异步加一</button>
      </div>
    )
  }
}

export default App
```

### Nexted

if you want to split the store , you can make the state/actions/effects into a object , they will to be nested tree .

the object key will be the path , theris arguments are nexted .

```Javascript
const state = {
  counter:{
    count: 2
  }
}

const actions = {
  counter: {
    up(state, data) {
      state.count += data
    },
    down(state, data) {
      state.count -= data
    }
  }
}

@map({
  state:['counter/count'],
  actions:['counter/up','counter/down']
})

```
We made an appointment. state and actions and effects must have the same key , and in a same level object , must to be same types

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

### p.s.

smox 终于快要完成 2.0 的 feature 了，唠几句，smox 2.0 的致命之处：

1. 和 rematch、redux 不同，smox 完全移除了 model 、reducers、dispatch、action(type) 等 API，只保留 state、actions、effects 三个 API

2. redux 中，只有 dispatch 的 action 才会触发进而修改 state ，smox 也一样，只有 actions 被触发才会修改 state，而 actions 可以被 effects 调用，形成一个闭环，完美的架构设计

3. rematch、dva 中，models 用来划分 store，显式定义命名空间，单层作用域，笨拙且局限。smox 独创 path 机制，不需要手动定义 model，会根据 key 自动生成作用域，这是 smox 2.0 最成功的一个机制，精巧又灵活

4. rematch 等库，需要保证 reducer 同步的 return 一个新对象，来保证不可变，会丑。smox 自己实现了一个精巧的劫持，不可变的同时，不需要 return（其他库也可以通过 immer）

5. and so on……（1kb 尺寸、API 的设计度等等）

## Demo

- [Counter](https://github.com/132yse/smox/tree/master/examples/counter)
- [爱弹幕后台](https://github.com/132yse/idanmu-admin)

### Author

- blog: [伊撒尔の窝](http://www.yisaer.com)
- weibo: [@世界倒数第一公主殿下](http://weibo.com/oreshura)

### License

MIT
