import * as React from 'react'
import { getPlain } from '../smox/util'
const Context = React.createContext(null)
const Unbatch = props => props.children

export function Provider(props) {
  return (
    <Context.Provider value={props.store}>
      {typeof props.children.type === 'function' ? (
        props.children
      ) : (
        <Unbatch>{props.children}</Unbatch>
      )}
    </Context.Provider>
  )
}

export class Consumer extends React.Component {
  _isMounted: boolean
  context: any
  state: any
  setState: any
  props: any
  constructor(props) {
    super(props)
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
      .replace('/consumer', '')
      .replace('/provider/', '')
    let path = pathStr.split('/')

    path = path.splice(1) //去掉第一个组件

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
