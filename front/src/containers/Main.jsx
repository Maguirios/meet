import React, { Component } from 'react'
import { connect } from 'react-redux'
import Code from '../components/Code';

class Main extends Component {


  render() {
    return (
      <div>
        <Code/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

