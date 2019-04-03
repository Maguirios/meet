import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as moment from 'moment';
import RegisterContainer from './Register'
import SingIn from './SingIn'
import Streaming from './Streaming'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import GetMuiTheme from 'material-ui/styles/getMuiTheme'
import lightBaseTheme from  'material-ui/styles/baseThemes/lightBaseTheme'
 

class Main extends Component {

  render() {
    let time = 0
    const update = () => {
      time = moment().format('LT')
    }
    let newTime = () => {
      setInterval(
      update()
    , 1);}
 
    newTime()
    const { classes } = this.props;
    return (
      <div>
        {/* <Link to='/register'> REGISTRARSE </Link>
        <Link to='/singIn'> INICIAR SESION </Link>
        <Link to='/stream'> Streaming </Link>
        <Route path='/register' render= {({ history }) => <RegisterContainer  history={history}/>} />
        <Route path='/singIn' render= {({ history }) => <SingIn history={history}/>} /> */}
        <MuiThemeProvider  muiTheme={GetMuiTheme(lightBaseTheme)} >
        <div>
          <Streaming/>
        </div>
        </MuiThemeProvider>
        {/* <Route path='/stream' render= {({ history }) => <Streaming history={history}/>} /> */}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Main);

