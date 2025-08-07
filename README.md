# yjc
> Yeilding Javascript compiler

- Simplest bundler algorithm
- Smallest JavaScript compiler

input 

```js
import { hello } from './hello.js'

function world() {
  return 'World'
}

console.log(hello)
console.log(world())
```

output

```js
(function (global) {
const P$hello_js$hello = 'hello';

const P$index_js$world = () => console.log("world");

console.log(P$hello_js$hello);
console.log(P$index_js$world());
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this);
```
