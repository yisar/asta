import React from 'react'
import { resolveSource, bindCreators } from './utils'
import { mapToState, mapMethods } from "./helpers"

const Context = React.createContext(null)

export class Store {
  constructor({ state, mutations, actions }) {
    this.state = state
    this.mutations = mutations
    this.actions = actions
    this.subscribers = []
    this.dispatch = this.dispatch.bind(this)
    this.commit = this.commit.bind(this)
  }

  subscribe(sub) {
    return this.subscribers.push(sub)
  }

  unsubscribe(sub) {
    return this.subscribers.filter(f => f !== sub)
  }

  dispatch(type, payload) {
    const action = resolveSource(this.actions, type)
    const ctx = {
      commit: this.commit,
      dispatch: this.dispatch
    }
    return Promise.resolve(action(ctx, payload))
  }

  commit(type, payload) {
    const mutation = resolveSource(this.mutations, type)
    this.state = mutation(this.state, payload)
    this.subscribers.forEach(v => v())
  }
}

export const connect = (states=[], mutations=[], actions=[]) => Component => {
  return class WrapComp extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        props: {}
      }
    }

    componentWillMount() {
      this._isMounted = true
    }

    componentWillUnmount() {
      this._isMounted = false
      this.store.unsubscribe(() => this.update())
    }

    componentDidMount() {
      this.store.subscribe(() => this.update())
      this.update()
    }

    update() {
      const store = this.store
      const stateProps = mapMethods(store.state, states)
      const commitProps = bindCreators(mapMethods(store.mutations, mutations), store.commit)
      const dispatchProps = bindCreators(mapMethods(store.actions, actions), store.dispatch)
      if (this._isMounted) {
        this.setState({
          props: {
            ...this.state.props,
            ...stateProps,
            ...commitProps,
            ...dispatchProps
          }
        })
      }
    }

    render() {
      return (
        <Context.Consumer>
          {store => {
            this.store = store
            return <Component {...this.state.props} />
          }}
        </Context.Consumer>
      )
    }
  }
}

export class Provider extends React.Component {
  constructor(props) {
    super(props)
    this.store = this.props.store
  }

  render() {
    return (
      <Context.Provider value={this.store}>
        {this.props.children}
      </Context.Provider>
    )
  }
}