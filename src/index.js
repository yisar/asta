import { bindCreators } from './util'
import { mapMethods } from './helper'
const Context = React.createContext(null)
export const map = ({ state = [], mutations = [], actions = [] }) => Component => {
  return class extends React.Component {
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
    mapState() {
      const { res } = mapMethods(this.store.state, state)
      return res
    }
    mapMutations() {
      let { res, name } = mapMethods(this.store.mutations, mutations)
      return bindCreators(res, this.store.commit, name)
    }
    mapActions() {
      let { res, name } = mapMethods(this.store.actions, actions)
      return bindCreators(res, this.store.dispatch, name)
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
