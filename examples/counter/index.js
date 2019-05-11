import React from 'react'
import ReactDOM from 'react-dom'

class PathComponent extends React.Component {
  constructor (props) {
    super(props)
    this.props = {
      path: []
    }
  }
}

class App extends PathComponent {
  render () {
    return <Child />
  }
}

class Child extends PathComponent {
  render () {
    console.log(this.props.path.concat(this.constructor.name.toLowerCase()))
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

// export class PathComponent extends React.Component {
//   constructor (props) {
//     super(props)
//     this.path = props.path.concat(this.disPlayName)
//   }

//   render () {
//     return React.Children.map(this.props.children, child => {
//       React.cloneElement(child, {
//         path: this.path
//       })
//     })
//   }
// }
