<p align="center"><img src="https://ws1.sinaimg.cn/large/0065Zy9egy1fyuqe61tlej30b40b4gn6.jpg" alt="smox" width="150"/></p>
<p align="center"><img src="https://ws1.sinaimg.cn/large/0065Zy9egy1g3cjhwzv7dj31d80yck2x.jpg" alt="smox" width="800"/></p>
<h3 align="center">Smox .tiny but perfect state management.</h3>
<p align="center">
<a href="https://npmjs.com/package/smox"><img src="https://img.shields.io/npm/v/smox.svg?style=flat-square"></a>
<a href="https://npmjs.com/package/smox"><img src="https://img.shields.io/npm/dt/smox.svg?style=flat-square"></a>
<a href="https://bundlephobia.com/result?p=smox"><img src="https://img.shields.io/bundlephobia/minzip/smox.svg?style=flat-square"></a>
</p>

## Use

```shell
npm i smox -S
```

```js
import { Smox } from 'smox'

const state = {
  count: 0
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

smox 会根据嵌套对象的 key 作为 path，然后根据 path 来限定作用域，命中局部的状态和方法，如下：

```js
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

以上，了解嵌套的机制后，接下来看看如何用于 react——

## React

smox 用于 react 的核心在于 path 机制，新版本的 path 由 smox 自动生成，无需手动给

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

然后，看看子组件，怎么用

#### render props

smox 新版本只提供 render props 的封装，因为 render props 同时适用于 class 组件和 hook 组件，是最完美的拓展方式

和 Context API 极为相似，需要使用 Consumer 组件

```js
import { Consumer } from 'smox'

class App extends React.Component {
  render () {
    return (
      <Consumer>
        {({ state, actions, effects }) => ( //此处对应的 store 根目录的 state
          <>
            <h1>{state.count}</h1>
            <button onClick={actions.up}>+</button>
            <button onClick={actions.down}>-</button>
            <button onClick={effects.upAsync}>x</button>
          </>
        )}
      </Consumer>
    )
  }
}
```
以上，看上去没什么不同，重点来了，也就是 smox 的 path 机制

因为太难解释了，所以我 p 了一张图：
![](https://ws1.sinaimg.cn/mw690/0065Zy9egy1g3citm0pacj31e00ycgxk.jpg)

图中，相同的颜色，意味着 store 与 react 应用匹配到的作用域

不知道你看懂了没【汗颜】

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
  }
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
## Demo

- [Counter](https://ws1.sinaimg.cn/mw690/0065Zy9egy1g3cih8llu2j314a0ycdp6.jpg)

### License

MIT
