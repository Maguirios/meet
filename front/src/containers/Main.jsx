import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route, Link } from 'react-router-dom'
import RegisterContainer from './Register'
import SignIn from "./SingIn"
import SingIn from './SingIn';

class Main extends Component {


  render() {
    return (
      <div>
        <Link to='/register'> REGISTRARSE </Link>
        <Link to='/singIn'> INICIAR SESION </Link>
        <Route path='/register' render= {({ history }) => <RegisterContainer  history={history}/>} />
        <Route path='/singIn' render= {({ history }) => <SingIn history={history}/>} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

