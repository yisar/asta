(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', 'react'], factory) :
  (global = global || self, factory(global.smox = {}, global.React));
}(this, function (exports, React) { 'use strict';

  var copy = {};
  var make;
  var oldPath;
  function produce(state, produce, path) {
      var newState = proxy(state);
      if (oldPath !== path)
          make = false;
      oldPath = path;
      produce(newState);
      return make ? copy : state;
  }
  function proxy(state) {
      var handler = {
          get: function (obj, key) {
              if (typeof obj[key] === 'object' && obj[key] !== null) {
                  return new Proxy(obj[key], handler);
              }
              return make ? copy[key] : obj[key];
          },
          set: function (_, key, val) {
              copy[key] = val;
              make = true;
              return true;
          },
          deleteProperty: function (_, key) {
              delete copy[key];
              make = true;
              return true;
          }
      };
      return new Proxy(state, handler);
  }

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
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

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

  function getPlain(path, source) {
      var i = 0;
      while (i < path.length) {
          source = source[path[i++]];
      }
      return source;
  }
  function setPlain(path, value, source) {
      var target = {};
      if (path.length) {
          target[path[0]] =
              path.length > 1 ? setPlain(path.slice(1), value, source[path[0]]) : value;
          return __assign({}, source, target);
      }
      return __assign({}, source, value);
  }

  var Smox = (function () {
      function Smox(_a) {
          var _b = _a.state, state = _b === void 0 ? {} : _b, _c = _a.actions, actions = _c === void 0 ? {} : _c, _d = _a.effects, effects = _d === void 0 ? {} : _d;
          this.state = state;
          this.actions = this.wireActions([], state, actions);
          this.effects = this.wireEffects([], actions, effects);
          this.subs = [];
      }
      Smox.prototype.wireActions = function (path, state, actions) {
          var _this = this;
          Object.keys(actions).forEach(function (key) {
              typeof actions[key] === 'function'
                  ? (function (key, action) {
                      actions[key] = function (data) {
                          var res = produce(state, function (draft) { return action(draft, data); }, path);
                          this.state = setPlain(path, res, this.state);
                          this.subs.forEach(function (fun) { return fun(); });
                      }.bind(_this);
                  })(key, actions[key])
                  : _this.wireActions(path.concat(key), state[key], actions[key]);
          });
          return actions;
      };
      Smox.prototype.wireEffects = function (path, actions, effects) {
          var _this = this;
          Object.keys(effects).forEach(function (key) {
              typeof effects[key] === 'function'
                  ? (function (key, effect) {
                      effects[key] = function (data) { return effect(actions, data); };
                  })(key, effects[key])
                  : _this.wireEffects(path.concat(key), actions[key], effects[key]);
          });
          return effects;
      };
      Smox.prototype.subscribe = function (sub) {
          this.subs.push(sub);
      };
      Smox.prototype.unsubscribe = function (sub) {
          this.subs = this.subs.filter(function (f) { return f !== sub; });
      };
      return Smox;
  }());

  var Context = React.createContext(null);
  var Unbatch = function (props) { return props.children; };
  var isPath = function (item, index) {
      return item !== 'provider' && item !== 'consumer' && index === 0;
  };
  function Provider(props) {
      return (React.createElement(Context.Provider, { value: props.store }, typeof props.children.type === 'function' ? (props.children) : (React.createElement(Unbatch, null, props.children))));
  }
  var Consumer = (function (_super) {
      __extends(Consumer, _super);
      function Consumer(props) {
          return _super.call(this, props) || this;
      }
      Consumer.prototype.getPath = function (fiber) {
          if (fiber === null)
              fiber = this._reactInternalFiber;
          var path = typeof fiber.elementType === 'function'
              ? fiber.elementType.name.toLowerCase()
              : [];
          if (fiber.return)
              path = this.getPath(fiber.return).concat(path);
          return path;
      };
      Consumer.prototype.componentDidMount = function () {
          var _this = this;
          this.isMount = true;
          this.context.subscribe(function () { return _this.setState({}); });
          this.setState({});
      };
      Consumer.prototype.render = function () {
          var _a = this.context, state = _a.state, actions = _a.actions, effects = _a.effects;
          var path = this.getPath(null).filter(isPath);
          return this.isMount
              ? this.props.children({
                  state: getPlain(path, state),
                  actions: getPlain(path, actions),
                  effects: getPlain(path, effects),
              })
              : null;
      };
      Consumer.prototype.componentWillUnmount = function () {
          var _this = this;
          this.isMount = false;
          this.context.unsubscribe(function () { return _this.setState({}); });
      };
      Consumer.contextType = Context;
      return Consumer;
  }(React.Component));

  exports.Consumer = Consumer;
  exports.Provider = Provider;
  exports.Smox = Smox;
  exports.produce = produce;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
