<img src="docs/doux.png" alt="logo" height="150" align="right" />

# Doux [![CircleCI](https://circleci.com/gh/yisar/doux.svg?style=svg)](https://circleci.com/gh/yisar/doux) [![npm](https://img.shields.io/npm/v/doux.svg?label=)](https://npmjs.com/package/doux)

> Simple reactivity system with composition API.

### Motivation

Hooks API has mental burden and unsolvable defects, this library can solve the following problems:

1. Heavy state and repeated initialization.

In hooks API, Hooks will be initialized repeatedly. If there is a complex state, rendering will be blocked.

```js
const [complexState] = useState(heavyData) // blocked
```

In Composition API, every component return a render function, this function will be rerendered every time, and state is initialized only once.

```js
const data = reactive({ count: 0 }) // once
return () => vdom // every time
```

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
render(<App />, document.getElementById('root'))
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

Also you can receive a pure funtion without any logics:

```js
const store = reactive({
  count: 0
})
const App = setup(() => (
  <div>
    <div>{store.count}</div>
    <button onClick={() => store.count++}>+</button>
  </div>
))
```

For the closures, the reactive must nn parent scope.

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

It accepts an effect function and run it when data changed.

```js
const data = reactive({ count: 0 })
watch(() => console.log(data.count))
data.count++ // console 1
```

It will return a cleanup callback, you can use it to cleanup effects.

```js
const cleanup = watch()
cleanup(()=> do()) // run both unmount and before update
```

In some cases, we may also want to watch with sources

```js
// getter
const state = reactive({ count: 0 })
watch(() => state.count, (count, prevCount) => do())

// ref
const count = ref(0)
watch(count, (count, prevCount) => do())
```

Finally you can cleanup watcher

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

### Lifecycles

Noneed lifecycles, use watch like useeffect:

| watch             | useEffect                   |
| ----------------- | --------------------------- |
| watch(f)          | useEffect(f)                |
| watch([x],f)      | useEffect(f,[x])            |
| setup             | useEffect(f,[])             |
| cleanup = watch() | useEffect(() => cleanup,[]) |

### License

MIT ©yisar inspired by [vue-next](https://github.com/vuejs/vue-next)
