<p align="center"><img src="http://ww1.sinaimg.cn/large/85564debgy1froiubji5aj207f03nq34.jpg" alt="smox logo"></p>

[![NPM version](https://img.shields.io/npm/v/smox.svg?style=flat-square)](https://npmjs.com/package/smox)
[![NPM downloads](https://img.shields.io/npm/dm/smox.svg?style=flat-square)](https://npmjs.com/package/smox)

# Smox

> Fast 1kB state management used New context api and Proxy which is similar to Vuex.

### Feature

:pig_nose: New Context Api used and Api is similar to Vuex

:jack_o_lantern: Tiny size, 1Kb gzipped, no Dependencies

:ghost: High Performance without optimization because ES6 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)



:scream_cat: Great [Model](https://smox.js.org/guide/#model-%E6%9C%BA%E5%88%B6) and [Middleware](https://smox.js.org/guide/#%E4%B8%AD%E9%97%B4%E4%BB%B6%E6%9C%BA%E5%88%B6) mechanisms supported



## Docs
[smox documents](https://smox.js.org)

[smox新版本增加 model 机制，点我查看文档！](https://smox.js.org/guide/#model-%E6%9C%BA%E5%88%B6)

[smox新版本增加中间件机制，点我查看文档！](https://smox.js.org/guide/#%E4%B8%AD%E9%97%B4%E4%BB%B6%E6%9C%BA%E5%88%B6)

[smox新版本增加 react hooks 支持，点我查看文档！](https://smox.js.org/guide/#%E4%B8%AD%E9%97%B4%E4%BB%B6%E6%9C%BA%E5%88%B6)
## Install

```shell
npm i smox -S
```

## Use

smox 新版本支持 model 机制拆分，以下代码默认是 `单model`，大型项目需要拆分 model，请[参阅文档](https://github.com/132yse/smox#docs)

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import App from './app.js'
import { Store, Provider } from 'smox'

const state = {
  count: 2
}

const actions = {
  asyncAdd({ commit }) {
    setTimeout(() => {
      commit('add')
    }, 1000)
  }
}

const mutations = {
  add(state) {
    state.count += 1
  },
  cut(state) {
    state.count -= 1
  }
}

const store = new Store({ state, mutations, actions })

ReactDOM.render(
  <Provider store = {store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

then app.js

```javascript
import React from 'react'
import { map } from 'smox'

@map({
  state: ['count'],
  mutations: ['add', 'cut'],
  actions: ['asyncAdd']
})
```

```javascript
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>现在是{this.props.count}</h1>
        <button onClick={this.props.add}>加一</button>
        <button onClick={this.props.cut}>减一</button>
        <button onClick={this.props.asyncAdd}>异步加一</button>
      </div>
    )
  }
}

export default App
```
#### React Hooks also is OK

there is a `useSmox` API that is similar to `useReducer` API , for example:

```javascript
import React from 'react'
import { useSmox } from 'smox'
const mutations = {
  change(state) {
    state.sex = state.sex === 'boy' ? 'girl' : 'boy'
  }
}

const actions = {
  asyncChange({ commit }, payload) {
    setTimeout(() => {
      commit('change', payload)
    }, 1000)
  }
}

const state = {
  sex: 'boy'
}

export const Sex = () => {

  const [state, commit, dispatch] = useSmox(state, mutations, actions)
  
  return (
    <div>
      {state.sex}
      <button onClick={() => commit('change')}>变性</button>
      <button onClick={() => dispatch('asyncChange')}>异步变性</button>
    </div>
  )
}
```


if you only SetState , there is also a `produce` API to optimize performance

```javascript
import React from 'react'
import { produce } from 'smox'

class App extends React.Component {
  onClick = () => {
    this.setState(
        produce(state => {
            state.count += 1
        })
    )
  }
}

export default App
```

# API

* store.state
* store.mutations
* store.actions
* store.commit(mutation)
* store.dispatch(action)
* store.subscribe(sub)

* map({
      state:[],
      mutations:[],
      actions:[]
    })

* produce(state,producer)
* useSmox(mutations,actions,state)

## Demo

* [Counter](https://github.com/132yse/smox-counter)
* [爱弹幕后台](https://github.com/132yse/idanmu-admin)


### Author

* blog: [伊撒尔の窝](http://www.yisaer.com)
* weibo: [@世界倒数第一公主殿下](http://weibo.com/oreshura)

### License
MIT
Inspirated by [vuex](https://github.com/vuejs/vuex) & [immer](https://github.com/mweststrate/immer)

![smox缩略图](http://wx4.sinaimg.cn/thumb150/0060lm7Tly1fsk4halu0hj309k09k0t8.jpg)