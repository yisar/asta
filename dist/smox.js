(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.smox = {}));
}(this, function (exports) { 'use strict';

  function produce(state, produce) {
      var newState = Proxy ? proxy(state) : defineProperty(state);
      produce(newState);
      return newState;
  }
  function proxy(state) {
      var copy = {};
      var make;
      var handler = {
          get: function (obj, key) {
              if (typeof obj[key] === 'object' && obj[key] !== null) {
                  return new Proxy(obj[key], handler);
              }
              return make ? copy[key] : obj[key];
          },
          set: function (_, key, val) {
              console.log('111');
              copy[key] = val;
              make = true;
              return true;
          }
      };
      return new Proxy(state, handler);
  }
  function defineProperty(state) {
      var copy = JSON.parse(JSON.stringify(state));
      var newState = {};
      Object.keys(copy).forEach(function (key) {
          if (typeof copy[key] === 'object')
              defineProperty(copy[key]);
          newState = walk(copy, key, copy[key]);
      });
      function walk(obj, key, val) {
          return Object.defineProperty(obj, key, {
              get: function () {
                  return val;
              },
              set: function (newVal) {
                  if (newVal !== val) {
                      val = newVal;
                  }
              },
              enumerable: true
          });
      }
      return newState;
  }
  //# sourceMappingURL=index.js.map

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function setPartialState(path, value, source) {
      var target = {};
      if (path.length) {
          target[path[0]] =
              path.length > 1
                  ? setPartialState(path.slice(1), value, source[path[0]])
                  : value;
          return __assign({}, source, target);
      }
      return value;
  }
  function getPartialState(path, source) {
      var i = 0;
      while (i < path.length) {
          source = source[path[i++]];
      }
      return source;
  }
  //# sourceMappingURL=util.js.map

  var Store = (function () {
      function Store(_a) {
          var _b = _a.state, state = _b === void 0 ? {} : _b, _c = _a.actions, actions = _c === void 0 ? {} : _c;
          this.state = state;
          this.actions = this.wireActions([], state, actions);
      }
      Store.prototype.wireActions = function (path, state, actions) {
          var _this = this;
          Object.keys(actions).forEach(function (key) {
              typeof actions[key] === 'function'
                  ? (function (key, action) {
                      actions[key] = function (data) {
                          var res = action(state, data);
                          if (typeof res === 'function') {
                              res = res(getPartialState(path, this.state));
                          }
                          this.state = setPartialState(path, res, this.state);
                          return res;
                      };
                  })(key, actions[key])
                  : _this.wireActions(path.concat(key), state[key], actions[key]);
          });
          return actions;
      };
      return Store;
  }());

  var state = {
      counter: {
          count: 0
      }
  };
  var actions = {
      counter: {
          up: function (state, data) {
              state.count + data;
          }
      }
  };
  var store = new Store({ state: state, actions: actions });
  console.log(store.actions.counter.up(1));
  //# sourceMappingURL=index.js.map

  exports.produce = produce;
  exports.Store = Store;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
