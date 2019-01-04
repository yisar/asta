<p align="right"><b>v2.0 - beta0</b></p>
<p align="center"><img src="https://ws1.sinaimg.cn/large/0065Zy9egy1fyupzauqksj30b40b4dh2.jpg" alt="smox logo" width="220"></p>

# Smox  [![NPM version](https://img.shields.io/npm/v/smox.svg?style=flat-square)](https://npmjs.com/package/smox)  [![NPM downloads](https://img.shields.io/npm/dm/smox.svg?style=flat-square)](https://npmjs.com/package/smox)

> Fast 2kB state management based on path-proxing.

### Feature

:pig_nose: New Context Api used

:jack_o_lantern: Tiny size, 2Kb gzipped, no Dependencies

:ghost: High Performance without optimization

## Docs

[smox documents](https://smox.js.org)

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

const effects = {
  async add() {
    await new Promise(t => setTimeout(t, 1000))
    actions.up()
  }
}

const actions = {
  up(state) {
    state.count++
  },
  down(state) {
    state.count--
  }
}

const store = new Store({ state, actions, effects })

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.body
)
```

then app.js

```javascript
import React from 'react'
import { map } from 'smox'

@map({
  state: ['count'],
  actions: ['add'],
  effects:['up']
})
```

```javascript
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>现在是{this.props.count}</h1>
        <button onClick={this.props.up}>加一</button>
        <button onClick={this.props.down}>减一</button>
        <button onClick={this.props.add}>异步加一</button>
      </div>
    )
  }
}

export default App
```

if you only SetState , there is also a `produce` API to optimize performance

```javascript
import React from 'react'
import { produce } from 'smox'

class App extends React.Component {
  onClick = () => {
    this.setState(
      produce(this.state, draft => {
        draft.count += 1
      })
    )
  }
}

export default App
```

## Demo

- [Counter](https://github.com/132yse/smox-counter)
- [爱弹幕后台](https://github.com/132yse/idanmu-admin)

### Author

- blog: [伊撒尔の窝](http://www.yisaer.com)
- weibo: [@世界倒数第一公主殿下](http://weibo.com/oreshura)

### License

MIT
Inspirated by [vuex](https://github.com/vuejs/vuex) & [immer](https://github.com/mweststrate/immer)

![smox缩略图](http://wx4.sinaimg.cn/thumb150/0060lm7Tly1fsk4halu0hj309k09k0t8.jpg)
