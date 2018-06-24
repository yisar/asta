## 快速上手

### 安装
#### npm
```shell
npm i smox -S
```
#### yarn
```shell
yarn add smox -S
```
### 使用

我们以一个counter应用为例

#### 第一步，在 react 的入口文件中引入并创建 store
```javascript
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
```
如上，Store 是一个类，接受三个参数，state 即为 state 对象，必传，

mutations 是要对 state 的操作，mutation 的操作是同步的，也是必传的，state 只能由 commit mutation 来改变

mutation 接收 state 对象，内部 `state = ` 的操作是响应的，无需 return

actions 是异步操作的集合，它的每一个 action 都会 commit 一个 mutation

可以看到，整个的 API 是和 vuex 一模一样的，接下来需要将 创建好的 store 实例注入到 react 中

#### 第二步，将 store 注入到 react 中
```javascript
ReactDOM.render(
  <Provider store = {store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```
这里用到了 Provider 这个 API ，注入方式和 redux 又是一模一样的，Provider 只能用一次，也就是单 store，而且要放在业务组件的最外部

有了这一步，组件内部就可以通过`this.props.store`拿到实例，也可以使用 store.commit 提交 mutation 了

但是，为了更加友好，smox 仍然和 redux 一样，提供了 connect 的 API

#### 第三步，组件内使用 connect

```javascript
import { connect } from 'smox'

@connect( ['count'], ['add','cut'], ['asyncAdd'] )

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
```

connect 是一个高阶组件，可以通过装饰器的写法，接受三个参数，都是数组，分别对应 state 、 mutations 、 actions 的 key

它的作用是，将这些 key 对应的值和方法遍历到 props 里

所以，`this.props.count` 相当于 `this.porps.store.state.count`,调用`this.props.add` 相当于 `this.porps.store.mutations.add`

用哪个就传哪个的 key，可以最少的调用方法，提高性能

这样一来，一个简单的 Counter 应用就搞定啦，是不是非常简单！

先别急，我们还可以整理整理代码

### 推荐目录结构

我们都知道 redux 中拆分 reducer、action，是不太好搞的，需要 combineReducers 来合并
但是 smox 可以不用，因为 smox 对应的都是对象，所以我们直接 `export default {}`即可

我推荐是这个结构：
```shell
├── index.js                #入口文件
├── components              #业务组件
│   ├── App.js 
│   └── ...
└── store
    ├── index.js            # 创建并导出 store 的地方
    ├── mutations.js        # mutation
    └── actions.js          # actions
```

好的，这样一来，一个`拆分合理`、`代码优雅`的应用就搞定了，

[请参见 Counter github源码](https://github.com/132yse/smox-counter)


以上只是对最基本的操作进行阐述，更骚的操作请阅读[详细教程→](/guide/)