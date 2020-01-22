(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = global || self, factory(global.Qox = {}, global.React));
}(this, (function (exports, React) { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;

  var trackStack = [];
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
  function setup(component) {
      var vdom = component();
      return function () {
          var update = useForceUpdate();
          trackStack.push(function () { return update(); });
          return vdom();
      };
  }
  function track(target, key) {
      var effect = trackStack.pop();
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
  function trigger(target, key) {
      var deps = targetMap.get(target);
      var effects = new Set();
      deps.get(key).forEach(function (e) { return effects.add(e); });
      effects.forEach(function (e) { return e(); });
  }
  function useForceUpdate() {
      var _a = React.useState(0), setTick = _a[1];
      return React.useCallback(function () { return setTick(function (tick) { return tick + 1; }); }, []);
  }

  exports.reactive = reactive;
  exports.setup = setup;
  exports.track = track;
  exports.trigger = trigger;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
