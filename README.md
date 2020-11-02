<img src="docs/doux.png" alt="logo" height="150" align="right" />

# Doux [![Build Status](https://github.com/yisar/doux/workflows/ci/badge.svg?branch=master)](https://github.com/yisar/doux/actions) [![npm](https://img.shields.io/npm/v/doux.svg?label=)](https://github.com/yisar/doux) [![license](https://img.shields.io/github/license/yisar/doux.svg)](https://github.com/yisar/doux)

> Immutable reactivity system, made with ES6 Proxy.

### Motivation

Hooks API has mental burden and unsolvable defects, this library can solve the following problems:

- Heavy state and repeated initialization.

In hooks API, Hooks will be initialized repeatedly. If there is a complex state, rendering will be blocked.

```js
const [complexState] = useState(heavyData) // blocked
```

- State management and Context proplems.

There is a performance problem with context. All children of Context need to be rerender.

```js
<Provier>
  {this.props.children} // all children will rerender.
<Provider/>

```

### Use

```shell
npm i doux -S
```

```js
import { observer, observable } from 'doux'
import { render } from 'react-dom'

const data = observable({ count: 0 })

const App = observer(() => (
  <div>
    <div>{data.count}</div>
    <button onClick={() => data.count++}>+</button>
  </div>
))

render(<App />, document.getElementById('root'))
```

### observer

Like memo or lazy, it receive a component and return a new component

```js
const App = observer(Component)
```

### observable

Like `createContext`, It create a observable object

#### Dependency collection

An accurate update way, it collects dependency in the initialization phase, establishes the mapping relationship between components and data, and updates the corresponding components when the data changes.

More is [here](https://github.com/vuejs/docs-next/blob/master/src/guide/reactivity.md)

#### write on copy

The main idea comes from [immer.js](https://github.com/immerjs/immer) , when setting, the mutation is applied to the copy, and the copy is taken first when getting, keeping the immutable characteristics, and applying mutations.

### License

MIT ©yisar
