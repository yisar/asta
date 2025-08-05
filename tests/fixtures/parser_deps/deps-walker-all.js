import 'hello';

const paren = (require("lodash"));
const list = [require("underscore"), 0];
const obj = { debounce: require("debounce"), x() {} };
var regex = /[a-z]+/g + `x`;
const lazy = function*() {
  yield require("assert")
  throw new Error("Code should be unreachable");
  (function* gen() { yield 1; })();
}
with(b) for(;;);
do{}while(0);
a: for (var x in [1,2,3]) {
  if (x == 1) continue;
  break a;
}
(class {
  set a(v) {}
  get a() {}
  static x() {}
})
for ([{x}] of y) {}
export let x = 1;
export default function() {};
export class a extends (b,c) {};
try{} catch(x) {} finally{}
