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

对外暴露 Global 和 Local 组件，意思是全局 store 和 局部（经过 path 匹配过的） store

为什么使用 render props 而不是 HOC？由于 hooks API 的出现，导致 HOC 只适用于 class API，render props 可同时适用于 class 和 function，是最合适的拓展机制

```js
import { Global, Local } from 'smox'

class App extends React.Component {
  render() {
    return (
      <Local>
        {store => (
          <>
            <h1>{store.state.count}</h1>
            <button onClick={store.actions.up}>+</button>
            <button onClick={store.actions.down}>-</button>
            <button onClick={store.effects.upAsync}>x</button>
          </>
        )}
      </Local>
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

### Path

path 是一个匹配机制，举例说明：

```js
const state = {
  counter: {
    count: 0,
  },
}

const actions = {
  counter: {
    up(state, data) {
      //此处的 state 为同路径的 { count:0 }
      state.count += data
    },
    down(state, data) {
      state.count -= data
    },
  },
}

const effects = {
  counter: {
    async upAsync(actions) {
      //此处的 actions 为同路径的 { up(), down() }
      await new Promise(t => setTimeout(t, 1000))
      actions.up()
    },
  },
}
```

可以看到，跟对象下面的 counter 对象，此时的 path 是 `/counter`

现在我们有个 `<App />` 跟组件，它默认匹配全局的 store，此时它的 path 是 `/`

然后 `<App />` 有个子组件 `<Counter />`,这个组件的 path 是 `/counter`，那么它匹配的就是 store 对象下面的 counter 对象的属性和方法

```js
function App() {
  //跟组件匹配的是全局 store
  return <Counter />
}

function Counter() {
  return (
    <Local>
      {({ state, actions, effects }) => (
        /*此处是 counter 对象中的 
        { state:{ count }, 
          actions:{ up(), down() }, 
          effects:{ asyncUp() } 
        }*/
        <>
          <h1>{state.count}</h1>
          <button onClick={actions.up}>+</button>
          <button onClick={actions.down}>-</button>
          <button onClick={effects.upAsync}>x</button>
        </>
      )}
    </Local>
  )
}
```

通过这个约定，我们不需要关心 store 的拆分，只需要按照规定安排 store 和 组件即可

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
