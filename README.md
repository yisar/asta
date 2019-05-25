<p align="center"><img src="https://user-images.githubusercontent.com/12951461/58321687-6e549b00-7e51-11e9-9312-9f81889bf4fa.jpg" width="150"/></p>
<p align="center"><img src="https://user-images.githubusercontent.com/12951461/58321688-6eed3180-7e51-11e9-8bc8-275db9dbdc19.jpg"  width="800"/></p>
<h3 align="center">Smox .Fast 1kB state management with prefect API.</h3>
<p align="center">
<a href="https://npmjs.com/package/smox"><img src="https://img.shields.io/npm/v/smox.svg?style=flat-square"></a>
<a href="https://npmjs.com/package/smox"><img src="https://img.shields.io/npm/dt/smox.svg?style=flat-square"></a>
<a href="https://bundlephobia.com/result?p=smox"><img src="https://img.shields.io/bundlephobia/minzip/smox.svg?style=flat-square"></a>
</p>

### Use

```shell
npm i smox -S
```

```js
import { Smox } from 'smox'

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

### React

使用 render porps ，可以方便的用于 react 组件中

为什么使用 render props 而不是 HOC？由于 hooks API 的出现，导致 HOC 只适用于 hooks API，render props 可同时适用于 class 和 function，是最合适的拓展机制

```js
import { Provider, Consumer } from 'smox'

class App extends React.Component {
  render () {
    return <>
      <Consumer>
        {({ state, actions, effects }) => (
          <>
            <h1>{state.count}</h1>
            <button onClick={actions.up}>+</button>
            <button onClick={actions.down}>-</button>
            <button onClick={effects.upAsync}>x</button>
          </>
        )}
      </Consumer>
    </>
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

### Proxy、async/await

Proxy、async/await 可以使得 actions 代码同步，更好看

```js
const actions = {
  up(state) {
    state.count += 1
    state.count += 2
  },
}
```

使用这个 [polyfill](https://github.com/GoogleChrome/proxy-polyfill) 可以兼容 ie9+

同时 effects 下面，配合 async/await，也能同步的编写逻辑

```js
const effects = {
  async upAsync(actions) {
    await new Promise(t => setTimeout(t, 1000))
    actions.up()
    actions.down()
  },
}
```

### Immed

immed 是 smox 内部的一个子包，它和 immer 类似，但是和 path 结合使用，性能更好

```js
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

### Demo

- [Counter](https://ws1.sinaimg.cn/mw690/0065Zy9egy1g3cih8llu2j314a0ycdp6.jpg)

### License

MIT
