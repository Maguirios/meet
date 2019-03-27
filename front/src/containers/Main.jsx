import React, { Component } from 'react'
import { connect } from 'react-redux'

<<<<<<< HEAD
class Main extends React.Component {
  
    render() {
        return (<div> MEET MAIN </div>)
    }
}
=======
class Main extends Component {


  render() {
    return (
      <div>
        hola
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

>>>>>>> 480c76e7e6a5ae3a86805db4f3c20a7958cd20c8
