import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as moment from 'moment';
import RegisterContainer from './Register'
import Code from '../components/Code';
import Chat from '../components/Chat';
import SignIn from "./SignIn"


class Main extends Component {

  render() {
    let time = 0
    const update = () => {
      time = moment().format('LT')
    }
    let newTime = () => {
      setInterval(
        update()
        , 1);
    }

    newTime()
    const { classes } = this.props;
    return (
      <div className='home'>
        <div className='home-top'>
          <Link to='/signIn'>
            <Button variant="contained" color="primary">
              INICIAR SESIÓN
          </Button>
          </Link>
          <Link to='/register'>
            <Button variant="contained" color="primary" id='register'>
              REGISTRARSE
          </Button>
          </Link>
        </div>
        <div className='home-center'>
          <img className='isologo-horizontal-white' src='/utils/images/logor.png' />
          <div className="components">
            <Route exact path='/chat' component={Chat} />
            <Route exact path='/register' render={({ history }) => <RegisterContainer history={history} />} />
            <Route exact path='/signIn' render={({ history }) => <SignIn history={history} />} />
            <Route exact path='/' component={Code} />
          </div>
        </div>
        <div className='home-bottom'>
          <div className="hora">{time}</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Main);

