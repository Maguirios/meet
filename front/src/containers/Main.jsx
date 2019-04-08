import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import GetMuiTheme from 'material-ui/styles/getMuiTheme'
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme'

import Home from '../containers/Home';
import Streaming from './Streaming'
import ButtonBar from './ButtonBar';
import firebase from '../firebase';

class Main extends Component {

    componentDidMount(){
       let db = firebase.database().ref('rooms')
        
        db.on('value', snapshoot => {
            console.log(Object.values(snapshoot.val()).filter((room) => (
                room.emails.some((user) => user === 'ombaez@gmail.com')
            )))
        })
    }


    render() {
        return (
            <div>
                <MuiThemeProvider muiTheme={GetMuiTheme(lightBaseTheme)} >
                        <Switch>
                            <Route path='/room/:code' render={({ history, match }) => <Streaming match={match} history={history} />} />
                            <Route path='/buttons' component={ButtonBar} />
                            <Route path='/' component={Home} />
                        </Switch>
                </MuiThemeProvider>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, null)(Main);

