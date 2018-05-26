'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

function resolveSource(source, type) {
  return typeof type === 'function' ? type : source[type];
}

function bindActionCreators(creators, dispatch) {
  return Object.keys(creators).reduce((ret, item) => {
    ret[item] = _bind(creators[item], dispatch);
    return ret;
  }, {});
}

function _bind(creator, dispatch) {
  return () => dispatch(creator);
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const { Provider, Consumer } = React.createContext(null);

class Store {
  constructor({ state, actions }) {
    this.state = state;
    this.actions = actions;
    this.subscribers = [];
    this.dispatch = this.dispatch.bind(this);
  }
  subscribe(sub) {
    return this.subscribers.push(sub);
  }

  dispatch(type) {
    const action = resolveSource(this.actions, type);
    this.state = action(this.state);
    this.subscribers.forEach(v => v());
  }
}

// 封装高阶组件，将state和dispatch遍历到props中
const withStore = Component => {
  return class WrapComp extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        props: {}
      };
    }
    componentWillMount() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    componentDidMount() {
      this.store.subscribe(() => this.update());
      this.update();
    }

    update() {
      const store = this.store;
      const stateProps = store.state;
      const dispatchProps = bindActionCreators(store.actions, store.dispatch);
      if (this._isMounted) {
        this.setState({
          props: _extends({}, this.state.props, stateProps, dispatchProps)
        });
      }
    }

    render() {
      return React.createElement(
        Consumer,
        null,
        store => {
          this.store = store;
          return React.createElement(Component, this.state.props);
        }
      );
    }
  };
};

module.exports = {
  Store,
  Provider,
  withStore
};
