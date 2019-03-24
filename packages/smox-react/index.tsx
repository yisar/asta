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
    isMounted: boolean
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
      this.isMounted = true
      this.actionsProps = mapToProps(actions, this.context.actions)
      this.effectsProps = mapToProps(effects, this.context.effects)
      this.context.subscribe(() => this.update())
      this.update()
    }
    componentWillUnmount() {
      this.isMounted = false
      this.context.unsubscribe(() => this.update())
    }
    update() {
      if (this.isMounted) {
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
  isMounted: boolean
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
    this.isMounted = false
    this.context.subscribe(() => this.setState(this.context))
  }
  render() {
    return this.isMounted ? this.props.to(this.context) : null
  }
  componentWillUnmount() {
    this.isMounted = false
    this.context.unsubscribe(() => this.setState(this.context))
  }
}
