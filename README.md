# Pak
> Tiny but beautiful JavaScript bundler

input 

```js
import {hello} from './hello.js'
function world() {
  return 'World';
}

console.log(hello)
console.log(world());
```

output

```js
(function (global) {
const P$hello_js$hello = 'hello';

const P$index_js$world = () => console.log("world");

const P$hello_js$hello = 'hello';
console.log(P$index_js$world())
})(typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : this);
```