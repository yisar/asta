# ijc
> Tiny Javascript compiler

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
const I$hello_js$hello = 'hello';

function I$index_js$world() {
  return 'World'
}

console.log(I$hello_js$hello);
console.log(I$index_js$world());
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this);
```
