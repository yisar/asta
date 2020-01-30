# Qox [![CircleCI](https://circleci.com/gh/yisar/qox.svg?style=svg)](https://circleci.com/gh/yisar/qox)  [![npm](https://img.shields.io/npm/v/qox.svg?label=)](https://npmjs.com/package/voe)

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

### setup

Like memo or lazy, it receive a different composition compoent and return a new component

```js
const App = setup(() => {
  return () => (
    <div>
      <div>{data.count}</div>
      <button onClick={() => data.count++}>+</button>
    </div>
  )
})
```
the composition component is different from hooks component, it return a pure render function, `return () => vdom`

Because closures, and from the second time on, the component will only reexecute this function.

This can solve the problem of repeated initialization rendering of hooks API.

### Composition API

- [reactive](https://github.com/yisar/qox#reactive)

- [watch](https://github.com/yisar/qox#watch)

- [ref](https://github.com/yisar/qox#ref)

- [computed](https://github.com/yisar/qox#computed)

#### reactive

It reversed a object and return a proxy object

```js
const data = reactive({ count: 0 })
console.log(data.count) // 0
data.count++
console.log(data.count) //1
```

#### watch

It will reserved an effect function and run it when deps changed.

```js
const data = reactive({ count: 0 })
watch(() => console.log(data.count))
data.count++ // console 1
```

#### ref

ref is another type of reactive, it just return an value

```js
const ref = ref(0)
console.log(ref.value) //0
```

#### computed

effect for reactive data, when deps changed, it will return a ref 

```js
const data = reactive({ count: 0 })
const double = computed(() => data.count * 2)
data.count++
```

### License

MIT ©yisar inspired by [vue-next](https://github.com/vuejs/vue-next)
