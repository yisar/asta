import * as React from 'react'

const Context = React.createContext(null)

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

export const inject = ({
  state = [],
  actions = [],
  effects = []
}) => Component => {
  return class extends React.Component {
    static contextType = Context
    props: any
    _isMounted: boolean
    state: any
    constructor(props) {
      super(props)
      this.state = {
        props: {}
      }
    }
    componentWillMount() {
      this._isMounted = true
      this.context.subscribe(() => this.update())
      this.update()
    }
    componentWillUnmount() {
      this._isMounted = false
      this.context.unsubscribe(() => this.update())
    }
    update() {
      if (this._isMounted) {
        const stateProps = mapToMethods(state, this.context.state)
        const actionsProps = mapToMethods(actions, this.context.actions)
        const effectsProps = mapToMethods(effects, this.context.effects)
        this.setState({
          props: {
            ...this.state.porps,
            ...stateProps,
            ...actionsProps,
            ...effectsProps
          }
        })
      }
    }
    render() {
      return <Component {...this.state.props} />
    }
  }
}

function mapToMethods(paths, source) {
  let res = {}
  paths.map(key => {
    let path = key.split('/')
    res[path[path.length - 1]] = getPlain(path, source)
  })
  return res
}

function getPlain(path: string[], source: any) {
  let i = 0
  while (i < path.length) {
    source = source[path[i++]]
  }
  return source
}
