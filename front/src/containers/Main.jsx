import React, { Component } from 'react'
import { connect } from 'react-redux'

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

