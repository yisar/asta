'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// 基础api

function createStore(reducer, enhanser) {
  if (enhanser) {
    return enhanser(createStore)(reducer);
  }
  var currentState = {};
  var currentListeners = [];

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    return currentListeners.push(listener);
  }

  function dispatch(action) {
    currentState = reducer(currentState, action);
    currentListeners.forEach(function (v) {
      return v();
    });
    return action;
  }

  dispatch({ type: '@132yse/SMox' });
  return { getState: getState, subscribe: subscribe, dispatch: dispatch };
}

// 多个中间件机制
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      var store = createStore.apply(undefined, args);
      var _dispatch = store.dispatch;

      var midApi = {
        getState: store.getState,
        dispatch: function dispatch(args) {
          return _dispatch(args);
        }
      };
      var middwareChain = middlewares.map(function (middware) {
        return middware(midApi);
      });
      _dispatch = compose.apply(undefined, toConsumableArray(middwareChain))(store.dispatch);
      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}

function compose() {
  for (var _len3 = arguments.length, funcs = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    funcs[_key3] = arguments[_key3];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(function (res, item) {
    return function () {
      return res(item.apply(undefined, arguments));
    };
  });
}

// 将action变成dispatch(action)
function bindActionCreators(creators, dispatch) {
  return Object.keys(creators).reduce(function (ret, item) {
    ret[item] = _bind(creators[item], dispatch);
    return ret;
  }, {});
}

function _bind(creator, dispatch) {
  return function () {
    return dispatch(creator.apply(undefined, arguments));
  };
}

var _React$createContext = React.createContext(null);

var Provider = _React$createContext.Provider,
    Consumer = _React$createContext.Consumer;
var connect = function connect(mapStateToProps, mapDispatchToProps) {
  return function (Component) {
    return function (_React$Component) {
      inherits(WrapComp, _React$Component);

      function WrapComp(props) {
        classCallCheck(this, WrapComp);

        var _this = possibleConstructorReturn(this, (WrapComp.__proto__ || Object.getPrototypeOf(WrapComp)).call(this, props));

        _this.state = {
          props: {}
        };
        return _this;
      }

      createClass(WrapComp, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
          this._isMounted = true;
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this._isMounted = false;
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          this.store.subscribe(function () {
            return _this2.update();
          });
          this.update();
        }
      }, {
        key: 'update',
        value: function update() {
          var store = this.store;
          var stateProps = mapStateToProps(store.getState());
          var dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch);
          if (this._isMounted) {
            this.setState({
              props: _extends({}, this.state.props, stateProps, dispatchProps)
            });
          }
        }
      }, {
        key: 'render',
        value: function render() {
          var _this3 = this;

          return React.createElement(
            Consumer,
            null,
            function (store) {
              _this3.store = store;
              return React.createElement(Component, _extends({ store: store }, _this3.state.props));
            }
          );
        }
      }]);
      return WrapComp;
    }(React.Component);
  };
};

var thunk = function thunk(_ref) {
  var dispatch = _ref.dispatch,
      getState = _ref.getState;
  return function (next) {
    return function (action) {
      if (typeof action == 'function') {
        return action(dispatch, getState);
      }
      return next(action);
    };
  };
};

var arrayThunk = function arrayThunk(_ref) {
  var dispatch = _ref.dispatch,
      getState = _ref.getState;
  return function (next) {
    return function (action) {
      if (Array.isArray(action)) {
        return action.forEach(function (v) {
          return dispatch(v);
        });
      }
      return next(action);
    };
  };
};

module.exports = {
  createStore: createStore,
  applyMiddleware: applyMiddleware,
  connect: connect,
  Provider: Provider,
  Consumer: Consumer,
  thunk: thunk,
  arrayThunk: arrayThunk
};
