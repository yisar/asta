import * as React from 'react'
import { mapToProps } from '../smox/util'
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

export const map = ({
  state = [],
  actions = [],
  effects = [],
}) => Component => {
  return class extends React.Component {
    static contextType = Context
    props: any
    _isMounted: boolean
    state: any
    stateProps: any
    actionsProps: any
    effectsProps: any
    context: any
    setState: Function
    constructor(props) {
      super(props)
      this.state = {
        props: {},
      }
    }
    componentDidMount() {
      this._isMounted = true
      this.actionsProps = mapToProps(actions, this.context.actions)
      this.effectsProps = mapToProps(effects, this.context.effects)
      this.context.subscribe(() => this.update())
      this.update()
    }
    componentWillUnmount() {
      this._isMounted = false
      this.context.unsubscribe(() => this.update())
    }
    update() {
      if (this._isMounted) {
        this.stateProps = mapToProps(state, this.context.state)
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

export class Subscribe extends React.Component {
  _isMounted: boolean
  context: any
  state: any
  setState: Function
  props: any
  constructor(props) {
    super(props)
    this.state = {}
  }
  static contextType = Context
  componentDidMount() {
    this._isMounted = true
    this.context.subscribe(() => this.setState({}))
    this.setState(this.context)
  }
  render() {
    return this._isMounted ? this.props.to(this.context) : null
  }
  componentWillUnmount() {
    this._isMounted = false
    this.context.unsubscribe(() => this.setState({}))
  }
}
