## 指南
### Model 机制

smox 提供 model 机制，用于大型项目的拆分，相似的机制在同类工具中也存在，如 vuex 的 module、rematch/dva 的 model
虽然相似，但 smox 却带来更好的 API ，以及更合理的细节体验

好啦，我们从一个变性的 demo 开始吧~

#### 建立 model

首先，一个 model 长这样：
```JavaScript
const sex = {
  state: {
    sex: 'boy'
  },
  mutations: {
    change(state, payload) {
      state.sex = payload
    }
  },
  actions: {
    asyncChange({ commit }, payload) {
      setTimeout(() => {
        commit('change', payload)
      }, 1000)
    }
  }
}
```
可以看到，我们只是在 `单model` 模式上，包了层对象，但是有了这层对象，就可以肆意的 export 啦
是的，到这里，我们一个 model 已经搞定了，值得一提的是，不需要写命名空间，smox 内部已经做了处理
但是与此同时，也存在一个约定，就是 actions 的 payload 将会是必传，因为内含 name

#### 创建 store

然后，创建 store:
```JavaScript
const store = new Store({ modelA, modelB, …… })

ReactDOM.render(
  <Provider store = {store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
``` 

是的，你没有看错，同样是一个对象，还记得 单model 是这样的：

```JavaScript
const store = new Store({ state, mutations, actions })
``` 

同样的，smox 内部做了相应处理
这里比同类工具都要先进，vuex 将 modules 作为第五个参数传递，多了一层 `root` 的概念，是 vuex 的痛点

这样一来，就完成了 model 的建立与注入，接下来就是组件内使用了

#### 组件内使用

```javascript
import { map } from 'smox'

@map({
  state: ['sex/sex'],
  mutations: ['sex/change'],
  actions: ['sex/asyncChange']
})

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>现在是{this.props.sex}</h1>
        <button onClick={this.props.change('girl')}>变性</button>
        <button onClick={this.props.change('girl')}>异步变性</button>
      </div>
    )
  }
}

```
是的，你没看错，就是这么简单，我们仍然用 map 语法糖，很方便的书写

其实和 rematch 一样，实现`dispatch('model/action')`非常简单，真正难的地方就在于封装 map (对应他们的 connect )

不得不说，同类工具，有了 model 机制，这个语法糖都会变得惨不忍睹

所以还是拥抱 smox 吧【泪奔】，复杂的事情我都搞定了

好啦，有了这个机制，我们就可以很方便的拆分目录结构啦！

同时也可以根据 API 进行拆分，所以两种方式结合，整个 React 应用可以拆的 片甲不留！

#### P.S.

model 仅仅是便于开发中拆分，smox 本身仍是单 store，拆分只是将业务逻辑拆开，所以仍然要利用好 `@map` 来按需加载

另外，smox 并不建议 滥用 model，大部分项目只需要 单model，而大型项目，大多数碰不到，所以 model 只是作为 优秀的机制 而存在

用不用具体场景具体分析哈！

### 推荐目录结构

我们都知道 redux 中拆分 reducer、action，是不太好搞的，需要 combineReducers 来合并
但是 smox 可以不用，因为 smox 对应的都是对象，所以我们直接 `export default {}`即可

smox 平时提倡 `单model`，但也确实存在 `多model`，因此目录拆分可能存在多种，大概可有以下两种：

#### 单model

因为是一个 model，也就是没有 model，所以直接根据语法糖拆分即可

```shell
├── index.js                #入口文件
├── components              #业务组件
│   ├── App.js 
│   └── ...
└── store
    ├── index.js            # 创建并导出 store 的地方
    ├── state.js            # state
    ├── mutations.js        # mutation
    └── actions.js          # actions
```
#### 多model

多个 model 就可以文件夹是 model 名，内容是是根据语法糖的拆分
```shell
├── index.js                            #入口文件
├── components                          #业务组件
│   ├── App.js 
│   └── ...
└── store ├── modelA                    # model 作为文件夹名
          |     ├── index.js            # 创建并导出 model 的地方
                ├── state.js            # state
          |     ├── mutations.js        # mutation
          |     └── actions.js          # actions
          └── modelB …
```

### produce 语法糖

smox 对外暴露一个 produce 的 API，用于外部的性能优化
它的作用是，使得一个对象变成可劫持的对象，这个思路来自 immer，也类似于 vue 的 proxy 函数

比如 setState 的时候：
```javascript
this.setState(
        produce(state => {
            state.count += 1
        })
    )
```
