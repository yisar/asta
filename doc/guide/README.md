## 指南
### Model 机制

smox 提供 model 机制，用于大型项目的拆分，相似的机制在同类工具中也存在，如 vuex 的 module、rematch/dva 的 model
虽然相似，但 smox 却带来更好的 API ，以及更合理的改变

好啦，我们开始吧~

#### 建立 model

首先，一个 model 长这样：
```JavaScript
const modelA = {
    state:{
        count:1
    },
    mutations:{
        add(state){
            state.count ++
        }
    },
    actions:{
        asyncAdd({ commit }) {
            setTimeout(() => {
                commit('add')
            }, 1000)
        }
    }
}
```
可以看到，我们只是在 `单model` 模式上，包了层对象，但是有了这层对象，就可以肆意的 export 啦
是的，到这里，我们一个 model 已经搞定了，值得一提的是，不需要写命名空间，smox 内部已经做了处理

#### 创建 store

然后，创建 store:
```JavaScript
const store = new Store({ modelA, modelB… })

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
这里比同类工具都要先进，vuex 将 modules 作为第五个参数传递，多了一层 `root` 的概念，是 vuex 的缺点

这样一来，就完成了 model 的建立与注入，接下来就是组件内使用了

#### 组件内使用

```javascript
import { map } from 'smox'

@map({
  state: ['moduleA/count'],
  mutations: ['moduleA/add'],
  actions: ['moduleA/asyncAdd']
})

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
是的，你没看错，就是这么简单，我们仍然用 map 语法糖，很方便的书写

其实和 rematch 一样，实现`dispatch('model/action')`非常简单，真正难的地方就在于封装 map(对应他们的 connect )

不得不说，同类工具，有了 model 机制，这个语法糖都会变得惨不忍睹

所以还是拥抱 smox 吧【泪奔】，复杂的事情我都搞定了

好啦，有了这个机制，我们就可以很方便的拆分目录结构啦！

同时也可以根据 API 进行拆分，所以两种方式结合，整个 React 应用可以拆的 片甲不留！

### P.S.

model 仅仅是便于开发中拆分，smox 本身仍是单 store，拆分只是将业务逻辑拆开，所以仍然要利用好 `@map` 来按需加载

另外，smox 并不建议 滥用 model，大部分项目只需要 单model，而大型项目，大多数碰不到，所以 model 只是作为 优秀的机制 而存在

用不用具体场景具体分析哈！