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


class Main extends Component {
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

