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

export class Consumer extends React.Component {
  _isMounted: boolean
  context: any
  state: any
  setState: any
  props: any
  constructor(props) {
    super(props)
    this.state = {}
  }
  getPath(fiber) {
    if (fiber === null) fiber = (this as any)._reactInternalFiber
    let path =
      typeof fiber.elementType === 'function'
        ? `/${fiber.elementType.name.toLowerCase()}`
        : ''
    if (fiber.return) path = `${this.getPath(fiber.return)}${path}`
    return path
  }
  static contextType = Context
  componentDidMount() {
    this._isMounted = true
    this.context.subscribe(() => this.setState({}))
    this.setState({})
  }
  render() {
    const { state, actions, effects } = this.context
    let pathStr = this.getPath(null)
    pathStr = pathStr.replace('/consumer', '').replace('/provider/', '')
    let path = pathStr.split('/').splice(0)
    return this._isMounted
      ? this.props.children({
          state: getPlain(path, state),
          actions: getPlain(path, actions),
          effects: getPlain(path, effects),
        })
      : null
  }
  componentWillUnmount() {
    this._isMounted = false
    this.context.unsubscribe(() => this.setState({}))
  }
}
