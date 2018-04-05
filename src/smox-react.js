import React from 'react'
import { bindActionCreators } from './smox'

export const { Provider, Consumer } = React.createContext(null)

// 封装高阶组件，将state和dispatch遍历到props中
export const connect = (mapStateToProps, mapDispatchToProps) => Component => {
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
      const stateProps = mapStateToProps(store.getState())
      const dispatchProps = bindActionCreators(
        mapDispatchToProps,
        store.dispatch
      )
      if(this._isMounted){
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
