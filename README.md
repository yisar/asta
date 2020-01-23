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

### Composition API

- [reactive](https://github.com/yisar/qox#reactive)

- [ref](https://github.com/yisar/qox#ref)

- [watch](https://github.com/yisar/qox#watch)

- [computed](https://github.com/yisar/qox#computed)

#### reactive

It reversed a object and return a proxy object

```js
const data = reactive({ count: 0 })
console.log(data.count) // 0
data.count++
console.log(data.count) //1
```

#### ref

Just return a value

```js
const ref = ref(0)
console.log(ref.value) //0
```

#### watch

It will reserved a function and run it when data changed

```js
watch(() => console.log(111))
```

#### computed

reactive with data

```js
const double = computed(() => data.count * 2)
```

### License

MIT ©yisar inspired by [vue-next](https://github.com/vuejs/vue-next)
