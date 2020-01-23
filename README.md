# Qox [![CircleCI](https://circleci.com/gh/yisar/qox.svg?style=svg)](https://circleci.com/gh/yisar/qox)
> 改名为 qox，重新开坑，在 react 中实现 composition API，弥补 hooks API 的缺陷

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
