import React, { Component } from 'react'
import { connect } from 'react-redux'
import SingUP from "../components/SingUp"

class Main extends Component {


  render() {
    return (
      <div>
   <SingUP/>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

