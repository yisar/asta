(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.smox = {}));
}(this, function (exports) { 'use strict';

  function produce(state, produce) {
      let newState = Proxy ? proxy(state) : defineProperty(state);
      produce(newState);
      return '111';
  }
  function proxy(state) {
      let copy = {};
      let make;
      let handler = {
          get(obj, key) {
              if (typeof obj[key] === 'object' && obj[key] !== null) {
                  return new Proxy(obj[key], handler);
              }
              return make ? copy[key] : obj[key];
          },
          set(_, key, val) {
              copy[key] = val;
              make = true;
              return true;
          }
      };
      return new Proxy(state, handler);
  }
  function defineProperty(state) {
      let copy = JSON.parse(JSON.stringify(state));
      let newState = {};
      Object.keys(copy).forEach(key => {
          if (typeof copy[key] === 'object')
              defineProperty(copy[key]);
          newState = walk(copy, key, copy[key]);
      });
      function walk(obj, key, val) {
          return Object.defineProperty(obj, key, {
              get() {
                  return val;
              },
              set(newVal) {
                  if (newVal !== val) {
                      val = newVal;
                  }
              },
              enumerable: true
          });
      }
      return newState;
  }

  exports.produce = produce;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
