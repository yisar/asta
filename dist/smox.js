'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = exports.Provider = exports.map = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.produce = produce;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Context = _react2.default.createContext(null);
var map = exports.map = function map(_ref) {
  var _ref$state = _ref.state,
      state = _ref$state === undefined ? [] : _ref$state,
      _ref$mutations = _ref.mutations,
      mutations = _ref$mutations === undefined ? [] : _ref$mutations,
      _ref$actions = _ref.actions,
      actions = _ref$actions === undefined ? [] : _ref$actions;
  return function (Component) {
    return function (_React$Component) {
      _inherits(_class, _React$Component);

      function _class(props) {
        _classCallCheck(this, _class);

        var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

        _this.state = {
          props: {}
        };
        return _this;
      }

      _createClass(_class, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          this._isMounted = true;
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var _this2 = this;

          this._isMounted = false;
          this.store.unsubscribe(function () {
            return _this2.update();
          });
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this3 = this;

          this.store.subscribe(function () {
            return _this3.update();
          });
          this.update();
        }
      }, {
        key: 'mapState',
        value: function mapState() {
          var _mapMethods = mapMethods(this.store.state, state),
              res = _mapMethods.res;

          return res;
        }
      }, {
        key: 'mapMutations',
        value: function mapMutations() {
          var _mapMethods2 = mapMethods(this.store.mutations, mutations),
              res = _mapMethods2.res,
              name = _mapMethods2.name;

          return bindCreators(res, this.store.commit, name);
        }
      }, {
        key: 'mapActions',
        value: function mapActions() {
          var _mapMethods3 = mapMethods(this.store.actions, actions),
              res = _mapMethods3.res,
              name = _mapMethods3.name;

          return bindCreators(res, this.store.dispatch, name);
        }
      }, {
        key: 'update',
        value: function update() {

          var stateProps = this.mapState();
          var commitProps = this.mapMutations();
          var dispatchProps = this.mapActions();
          if (this._isMounted) {
            this.setState({
              props: _extends({}, this.state.props, stateProps, commitProps, dispatchProps)
            });
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var _this4 = this;

          return _react2.default.createElement(
            Context.Consumer,
            null,
            function (store) {
              _this4.store = store;
              return _react2.default.createElement(Component, _this4.state.props);
            }
          );
        }
      }]);

      return _class;
    }(_react2.default.Component);
  };
};

var Provider = exports.Provider = function (_React$Component2) {
  _inherits(Provider, _React$Component2);

  function Provider(props) {
    _classCallCheck(this, Provider);

    var _this5 = _possibleConstructorReturn(this, (Provider.__proto__ || Object.getPrototypeOf(Provider)).call(this, props));

    _this5.store = _this5.props.store;
    return _this5;
  }

  _createClass(Provider, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        Context.Provider,
        { value: this.store },
        this.props.children
      );
    }
  }]);

  return Provider;
}(_react2.default.Component);

function combineModels(models) {
  var state = {},
      mutations = {},
      actions = {};
  Object.keys(models).forEach(function (i) {
    if (models[i].state) {
      state[i] = models[i].state;
    }
    if (models[i].mutations) {
      mutations[i] = models[i].mutations;
    }
    if (models[i].actions) {
      actions[i] = models[i].actions;
    }
  });
  return {
    state: state,
    mutations: mutations,
    actions: actions
  };
}

function mapMethods(method, type) {
  var name = method.state ? Object.keys(method)[0] : undefined;
  var content = splitContent(type);
  var res = {};
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = normalizeMap(content)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _ref3 = _step.value;
      var k = _ref3.k,
          v = _ref3.v;

      typeof v === 'function' ? res[k] = v : name ? res[k] = method[name][v] : res[k] = method[v];
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return {
    name: name,
    res: res
  };
}

var Store = exports.Store = function () {
  function Store(models) {
    _classCallCheck(this, Store);

    this.state = models.state ? models.state : combineModels(models).state;
    this.mutations = models.state ? models.mutations : combineModels(models).mutations;
    this.actions = models.state ? models.actions : combineModels(models).actions;
    this.subscribers = [];
    this.dispatch = this.dispatch.bind(this);
    this.commit = this.commit.bind(this);
  }

  _createClass(Store, [{
    key: 'subscribe',
    value: function subscribe(sub) {
      return this.subscribers.push(sub);
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(sub) {
      return this.subscribers.filter(function (f) {
        return f !== sub;
      });
    }
  }, {
    key: 'dispatch',
    value: function dispatch(type, payload, name) {
      if (name) {
        payload = {
          namespace: name,
          payload: payload
        };
      }
      var action = resolveSource(this.actions, type);
      var ctx = {
        commit: this.commit,
        dispatch: this.dispatch
      };
      return Promise.resolve(action(ctx, payload));
    }
  }, {
    key: 'commit',
    value: function commit(type, payload, name) {
      if (payload.namespace) {
        name = payload.namespace;
        payload = payload.payload;
      }
      type = splitType(type);
      var mutation = resolveSource(this.mutations, type, name);
      var model = Array.isArray(type) ? type[0] : name;
      typeof type === 'function' && name ? this.state[name] = produce(this.state[name], function (state) {
        mutation(state, payload);
      }) : model ? this.state[model] = produce(this.state[model], function (state) {
        mutation(state, payload);
      }) : this.state = produce(this.state, function (state) {
        mutation(state, payload);
      });
      this.subscribers.forEach(function (v) {
        return v();
      });
    }
  }]);

  return Store;
}();

var PROXY_STATE = 'proxy-state';

var State = function () {
  function State(base) {
    _classCallCheck(this, State);

    this.base = base;
    this.modifed = false;
    this.copy = null;
  }

  _createClass(State, [{
    key: 'get',
    value: function get(key) {
      if (!this.modifed) {
        return this.base[key];
      }
      return this.copy[key];
    }
  }, {
    key: 'set',
    value: function set(key, value) {
      if (!this.modifed) {
        this.modifing();
      }
      this.copy[key] = value;
      return true;
    }
  }, {
    key: 'modifing',
    value: function modifing() {
      if (this.modifed) return;
      this.modifed = true;
      this.copy = Array.isArray(this.base) ? this.base.slice() : Object.assign({}, this.base);
    }
  }]);

  return State;
}();

var handler = {
  get: function get(target, key) {
    if (key === PROXY_STATE) return target;
    return target.get(key);
  },
  set: function set(target, key, value) {
    return target.set(key, value);
  }
};
function produce(baseState, producer) {
  var state = new State(baseState);
  var proxy = new Proxy(state, handler);
  producer(proxy);
  var newState = proxy[PROXY_STATE];
  if (newState.modifed) {
    return newState.copy;
  }
  return newState.base;
}

function resolveSource(source, type, name) {
  if (typeof type === 'function') {
    return type;
  }
  return Array.isArray(type) ? source[type[0]][type[1]] : name ? source[name][type] : source[type];
}
function bindCreators(creators, operate, name) {
  return Object.keys(creators).reduce(function (ret, item) {
    ret[item] = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return operate.apply(undefined, [creators[item]].concat(args, [name]));
    };
    return ret;
  }, {});
}
function normalizeMap(map) {
  return Array.isArray(map) ? map.map(function (k) {
    return { k: k, v: k };
  }) : Object.keys(map).map(function (k) {
    return { k: k, v: map[k] };
  });
}

function splitContent(type) {
  var res = [];
  type.map(function (i) {
    type.indexOf('/') != -1 ? res.push(i.split('/')[1]) : res.push(i);
  });
  return res;
}

function splitType(type) {
  if (typeof type === 'function') {
    return type;
  }
  return type.indexOf('/') != -1 ? type.split('/') : type;
}