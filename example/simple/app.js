import React from 'react'
import { withStore } from '../index'

@withStore
class App extends React.Component {
  render() {
    return (
      <div>
        <h1>现在是{this.props.count}</h1>
        <button onClick={this.props.add}>加一</button>
      </div>
    )
  }
}

export default App
