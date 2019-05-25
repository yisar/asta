import * as React from 'react'
import { getPlain } from '../smox/util'
const Context = React.createContext(null)
const Unbatch = props => props.children
const isPath = (item, index) =>
  item !== 'provider' && item !== 'consumer' && index === 0

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
  isMount: boolean
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
        ? fiber.elementType.name.toLowerCase()
        : []
    if (fiber.return) path = this.getPath(fiber.return).concat(path)
    return path
  }
  static contextType = Context
  componentDidMount() {
    this.isMount = true
    this.context.subscribe(() => this.setState({}))
    this.setState({})
  }
  render() {
    const { state, actions, effects } = this.context
    let path = this.getPath(null).filter(isPath)

    return this.isMount
      ? this.props.children({
          state: getPlain(path, state),
          actions: getPlain(path, actions),
          effects: getPlain(path, effects),
        })
      : null
  }
  componentWillUnmount() {
    this.isMount = false
    this.context.unsubscribe(() => this.setState({}))
  }
}
