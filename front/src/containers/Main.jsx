import React, { Component } from 'react'
import { connect } from 'react-redux'
import Code from '../components/Code';
import { Route, Link } from 'react-router-dom'
import RegisterContainer from './Register'

class Main extends Component {


  render() {
    return (
      <div>
        <Code/>
        <Route exact path='/register' render= {({ history }) => <RegisterContainer  history={history}/>} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)

