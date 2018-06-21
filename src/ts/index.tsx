import * as React from 'react'
import { resolveSource, bindCreators, mapMethods } from './util'

const Context = React.createContext(null)

interface Fnc {
  [k: string]: Function
}

export class Store {
  state: any
  mutations: Fnc
  actions: Fnc
  subscribers: Function[]
  constructor({ state, mutations, actions }) {
    this.state = state
    this.mutations = mutations
    this.actions = actions
    this.subscribers = []
    this.dispatch = this.dispatch.bind(this)
    this.commit = this.commit.bind(this)
  }

  subscribe(sub: Function) {
    return this.subscribers.push(sub)
  }

  unsubscribe(sub: Function) {
    return this.subscribers.filter(f => f !== sub)
  }

  dispatch(type: Function | string, payload) {
    const action = resolveSource(this.actions, type)
    const ctx = {
      commit: this.commit,
      dispatch: this.dispatch
    }
    return Promise.resolve(action(ctx, payload))
  }

  commit(type: Function | string, payload) {
    const mutation = resolveSource(this.mutations, type)
    this.state = mutation(this.state, payload)
    this.subscribers.forEach(v => v())
  }
}
interface Iprops {
  store: any
}
interface Istate {
  props: any
}

export const connect = (states: string[] = [], mutations: string[] = [], actions: string[] = []) => Component => {
  return class WrapComp extends React.Component<Iprops, Istate> {
    _isMounted: boolean
    store: any
    props: any
    state: any
    setState: any
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

export class Provider extends React.Component<Iprops, Istate>{
  store: any
  props: any
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