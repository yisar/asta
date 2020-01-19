(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Qox = {}));
}(this, (function (exports) { 'use strict';

  var activeEffect = [];
  var targetMap = new WeakMap();
  var toProxy = new WeakMap();
  var toRaw = new WeakMap();
  var isObj = function (x) { return typeof x === 'object'; };
  function reactive(target) {
      if (!isObj(target))
          return target;
      var proxy = toProxy.get(target);
      if (proxy)
          return proxy;
      if (toRaw.has(target))
          return target;
      var handlers = {
          get: function (target, key, receiver) {
              var newValue = target[key];
              if (isObj(newValue)) {
                  return reactive(newValue);
              }
              var res = Reflect.get(target, key, receiver);
              track(target, key);
              return res;
          },
          set: function (target, key, value, receiver) {
              var res = Reflect.set(target, key, value, receiver);
              if (key in target)
                  trigger(target, key);
              return res;
          },
          deleteProperty: function (target, key, receiver) {
              return Reflect.defineProperty(target, key, receiver);
          }
      };
      var observed = new Proxy(target, handlers);
      toProxy.set(target, observed);
      toRaw.set(observed, target);
      if (!targetMap.has(target)) {
          targetMap.set(target, new Map());
      }
      return observed;
  }
  function setup(fn) {
      return applyEffect(fn);
  }
  function applyEffect(fn) {
      return function effect() {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
          }
          return run(effect, fn, args);
      };
  }
  function run(effect, fn, args) {
      if (activeEffect.indexOf(effect) === -1) {
          try {
              activeEffect.push(effect);
              return fn.apply(void 0, args);
          }
          finally {
              activeEffect.pop();
          }
      }
  }
  function trigger(target, key) {
      var deps = targetMap.get(target);
      var effects = new Set();
      deps.get(key).forEach(function (e) { return effects.add(e); });
      effects.forEach(function (e) { return e(); });
  }
  function track(target, key) {
      var effect = activeEffect[activeEffect.length - 1];
      if (effect) {
          var depsMap = targetMap.get(target);
          if (!depsMap) {
              targetMap.set(target, (depsMap = new Map()));
          }
          var dep = depsMap.get(key);
          if (!dep) {
              depsMap.set(key, (dep = new Set()));
          }
          if (!dep.has(effect)) {
              dep.add(effect);
          }
      }
  }

  exports.reactive = reactive;
  exports.setup = setup;
  exports.targetMap = targetMap;
  exports.track = track;
  exports.trigger = trigger;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
