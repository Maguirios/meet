import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import RegisterContainer from './Register'

class Main extends Component {


  render() {
    return (
      <div>
        <Link to='/register'> REGISTRARSE </Link>
        <Route path='/register' render= {({ history }) => <RegisterContainer  history={history}/>} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

