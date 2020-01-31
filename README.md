<img src="https://ws1.sinaimg.cn/large/0065Zy9ely1gbfzh2prx1j307q07udfq.jpg" alt="logo" height="120" align="right" />

# Doux [![CircleCI](https://circleci.com/gh/yisar/doux.svg?style=svg)](https://circleci.com/gh/yisar/doux)  [![npm](https://img.shields.io/npm/v/doux.svg?label=)](https://npmjs.com/package/doux)

_Simple, scalable state management_

> 改名为 doux，重新开坑，在 react 中实现 composition API，弥补 hooks API 的缺陷

### Use

```shell
npm i doux -S
```

```js
import { setup, reactive } from 'doux'
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

- [reactive](https://github.com/yisar/doux#reactive)

- [watch](https://github.com/yisar/doux#watch)

- [ref](https://github.com/yisar/doux#ref)

- [computed](https://github.com/yisar/doux#computed)

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
