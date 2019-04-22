import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import GetMuiTheme from 'material-ui/styles/getMuiTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'

import Home from './Home';
import Streaming from './Streaming'
import EndCall from '../components/EndCall'


class Main extends Component {


    render() {
        return (
            <div id='sala-conferencia'>
                <MuiThemeProvider muiTheme={GetMuiTheme(lightBaseTheme)} >
                        <Switch>
                            <Route path='/room/:code' render={({ history, match }) => <Streaming match={match} history={history} userName={this.props.userName} />} />
                            <Route path='/endcall' component={EndCall} />
                            <Route path='/' component={Home} />
                        </Switch>
                </MuiThemeProvider>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    userName: state.users.userName ? state.users.userName : state.firebase.auth.displayName,
  });
  const mapDispatchToProps = (dispatch) => ({
  
  })
  
  export default compose(firebaseConnect([
    'rooms']),
    connect(mapStateToProps, mapDispatchToProps))(Main)
  

