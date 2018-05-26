import { resolveSource } from './utils'
import React from 'react'
import { bindActionCreators } from './utils'

export const { Provider, Consumer } = React.createContext(null)

export class Store {
  constructor({ state, actions }) {
    this.state = state
    this.actions = actions
    this.subscribers = []
    this.dispatch = this.dispatch.bind(this)
  }
  subscribe(sub) {
    return this.subscribers.push(sub)
  }

  dispatch(type) {
    const action = resolveSource(this.actions, type)
    this.state = action(this.state)
    this.subscribers.forEach(v => v())
  }
}

// 封装高阶组件，将state和dispatch遍历到props中
export const withStore = Component => {
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
    }

    componentDidMount() {
      this.store.subscribe(() => this.update())
      this.update()
    }

    update() {
      const store = this.store
      const stateProps = store.state
      const dispatchProps = bindActionCreators(store.actions, store.dispatch)
      if (this._isMounted) {
        this.setState({
          props: {
            ...this.state.props,
            ...stateProps,
            ...dispatchProps
          }
        })
      }
    }

    render() {
      return (
        <Consumer>
          {store => {
            this.store = store
            return <Component {...this.state.props} />
          }}
        </Consumer>
      )
    }
  }
}
