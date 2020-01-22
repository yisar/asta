<p align="center"><img src="https://user-images.githubusercontent.com/12951461/58321687-6e549b00-7e51-11e9-9312-9f81889bf4fa.jpg" width="150"/></p>
<h3 align="center">Qox . Use composition API in React or Fre .</h3>
<p align="center">
<a href="https://github.com/yisar/qox"><img src="https://img.shields.io/github/stars/yisar/qox?style=flat-square"></a>
<a href="https://npmjs.com/package/qox"><img src="https://img.shields.io/npm/v/qox.svg?style=flat-square"></a>
<a href="https://npmjs.com/package/qox"><img src="https://img.shields.io/npm/dt/qox.svg?style=flat-square"></a>
<a href="https://bundlephobia.com/result?p=qox"><img src="https://img.shields.io/bundlephobia/minzip/qox.svg?style=flat-square"></a>
</p>

> 改名为 qox，重新开坑，在 react 中使用 composition API

### Use

```shell
npm i qox -S
```

```js
import { setup, reactive } from 'qox'
import { render } from 'react-dom'

const App = setup(() => {
  const data = reactive({ count: 0 })
  return () => (
    <div>
      <div>{data.count}</div>
      <button onClick={() => data.count++}>+</button>
    </div>
  )
})
render(<App />, document.body)
```

### License

MIT ©yisar inspired by [vue-next](https://github.com/vuejs/vue-next)
