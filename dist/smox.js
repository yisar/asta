'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Provider = exports.map = exports.Store = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.produce = produce;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PROXY_STATE = 'proxy-state';

var Store = exports.Store = function () {
    function Store(_ref) {
        var state = _ref.state,
            mutations = _ref.mutations,
            actions = _ref.actions;

        _classCallCheck(this, Store);

        this.state = state;
        this.mutations = mutations;
        this.actions = actions;
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
        value: function dispatch(type, payload) {
            var action = resolveSource(this.actions, type);
            var ctx = {
                commit: this.commit,
                dispatch: this.dispatch
            };
            return Promise.resolve(action(ctx, payload));
        }
    }, {
        key: 'commit',
        value: function commit(type, payload) {
            var mutation = resolveSource(this.mutations, type);
            this.state = produce(this.state, function (draft) {
                mutation(draft, payload);
            });
            this.subscribers.forEach(function (v) {
                return v();
            });
        }
    }]);

    return Store;
}();

var Context = _react2.default.createContext(null);
var map = exports.map = function map(_ref2) {
    var _ref2$state = _ref2.state,
        state = _ref2$state === undefined ? [] : _ref2$state,
        _ref2$mutations = _ref2.mutations,
        mutations = _ref2$mutations === undefined ? [] : _ref2$mutations,
        _ref2$actions = _ref2.actions,
        actions = _ref2$actions === undefined ? [] : _ref2$actions;
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
                key: 'update',
                value: function update() {
                    var stateProps = mapMethods(this.store.state, state);
                    var commitProps = bindCreators(mapMethods(this.store.mutations, mutations), this.store.commit);
                    var dispatchProps = bindCreators(mapMethods(this.store.actions, actions), this.store.dispatch);
                    if (this._isMounted) {
                        this.setState({
                            props: Object.assign({}, this.state.props, stateProps, commitProps, dispatchProps)
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
            return this.copy[key] = value;
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
        target.set(key, value);
        return true;
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

function resolveSource(source, type) {
    return typeof type === 'function' ? type : source[type];
}
function bindCreators(creators, operate) {
    return Object.keys(creators).reduce(function (ret, item) {
        ret[item] = function () {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return operate.apply(undefined, [creators[item]].concat(args));
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
function mapMethods(method, methods) {
    var res = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = normalizeMap(methods)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref4 = _step.value;
            var k = _ref4.k,
                v = _ref4.v;

            res[k] = method[v];
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

    return res;
}

