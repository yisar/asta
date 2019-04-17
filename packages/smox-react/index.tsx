import * as React from 'react'
import { getPlain } from '../smox/util'
export const Context = React.createContext(null)

export class Provider extends React.Component {
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

export const path = (path: string) => (Component: any) => {
  return class extends React.Component {
    static contextType = Context
    props: any
    _isMounted: boolean
    state: any
    stateProps: any
    actionsProps: any
    effectsProps: any
    context: any
    setState: any
    constructor(props) {
      super(props)
      this.state = {
        props: {},
      }
    }
    componentDidMount() {
      this._isMounted = true
      this.actionsProps = getPlain(path.split('/'), this.context.actions)
      this.effectsProps = getPlain(path.split('/'), this.context.effects)
      this.context.subscribe(() => this.update())
      this.update()
    }
    componentWillUnmount() {
      this._isMounted = false
      this.context.unsubscribe(() => this.update())
    }
    update() {
      if (this._isMounted) {
        this.stateProps = getPlain(path.split('/'), this.context.state)
        this.setState({
          props: {
            ...this.state.porps,
            ...this.stateProps,
            ...this.actionsProps,
            ...this.effectsProps,
          },
        })
      }
    }
    render() {
      return <Component {...this.state.props} />
    }
  }
}

export class Path extends React.Component {
  _isMounted: boolean
  context: any
  state: any
  setState: any
  props: any
  store: any
  constructor({ props }) {
    super(props)
    this.state = {}
    let path = props.to.split('/')
    const { state, actions, effects } = this.context
    this.store = {
      state: getPlain(path, state),
      actions: getPlain(path, actions),
      effects: getPlain(path, effects),
    }
  }
  static contextType = Context
  componentDidMount() {
    this._isMounted = true
    this.context.subscribe(() => this.setState({}))
    this.setState(this.store)
  }
  render() {
    return this._isMounted ? this.props.children(this.store) : null
  }
  componentWillUnmount() {
    this._isMounted = false
    this.context.unsubscribe(() => this.setState({}))
  }
}
