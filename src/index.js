import { bindCreators } from './util'
import { mapMethods } from './helper'
import React from 'react'

const Context = React.createContext(null)
export const map = ({
  state = [],
  mutations = [],
  actions = []
}) => Component => {
  return class extends React.Component {
    static contextType = Context
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
    mapState() {
      const { res } = mapMethods(this.context.state, state)
      return res
    }
    mapMutations() {
      let { res, name } = mapMethods(this.context.mutations, mutations)
      return bindCreators(res, this.context.commit, name)
    }
    mapActions() {
      let { res, name } = mapMethods(this.context.actions, actions)
      return bindCreators(res, this.context.dispatch, name)
    }
    update() {
      const stateProps = this.mapState()
      const commitProps = this.mapMutations()
      const dispatchProps = this.mapActions()
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
            return <Component {...this.state.props} />
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
