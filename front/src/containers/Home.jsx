import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as moment from 'moment';
import RegisterContainer from './Register'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'

import Code from '../components/Code';
import SignIn from "./SignIn"
import firebase from '../firebase';
import CreateRoom from './createRoom';
import Rooms from './UserRooms';
import { setLogin } from '../redux/action-creators/usersActions';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: moment().format('LT'),
    }
    this.signOut = this.signOut.bind(this)
    this.update = this.update.bind(this)
  }

  componentDidMount() {
    setInterval(this.update, 5000);
  }

  signOut() {
    firebase.auth().signOut()
    .catch(function (error) {
        console.log('El error fue', error)
      });
  }
  update() { this.setState({ time: moment().format('LT') }) };

  render() {

    const { classes, userLogin } = this.props;
    return (
      <div className='home'>
        <div className='home-top'>
          {!userLogin.isEmpty ?
            <div className="withUser">
              <Link to='/createRoom' style={{'textDecoration': 'none'}}>
                <Button variant="contained" color="primary">
                  CREAR SALA
                </Button>
              </Link>
              <Button variant="contained" id='salir' color="primary" onClick={this.signOut}>
                SALIR
              </Button>
            </div>
            :
            <div className='withoutUser'>
              <Link to='/signIn' style={{'textDecoration': 'none'}}>
                <Button variant="contained" color="primary">
                  INICIAR SESIÓN
                </Button>
              </Link>
              <Link to='/register' style={{'textDecoration': 'none'}}>
                <Button variant="contained" color="primary" id='register'>
                  REGISTRARSE
                </Button>
              </Link>
            </div>
          }
        </div>
        <div className='home-center'>
          <img className='isologo-horizontal-white' src='/utils/images/logor.png' />
          <div className="components">
            <Route path='/register' render={({ history }) => <RegisterContainer history={history} currentUser={!userLogin.isEmpty} />} />
            <Route path='/signIn' render={({ history }) => <SignIn history={history} currentUser={!userLogin.isEmpty} />} />
            <Route path='/createroom' render={({ history }) => <CreateRoom history={history} currentUser={userLogin} />} />
            {!userLogin.isEmpty ? <Route exact path='/' component={Rooms} /> : <Route exact path='/' component={Code} />}
          </div>
        </div>
        <div className='home-bottom'>
          <div className="hora">{this.state.time}</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  userLogin: state.firebase.auth,
})

const mapDispatchToProps = (dispatch) => ({
  setLogin: user => dispatch(setLogin(user)),
})

export default compose(firebaseConnect([
  'rooms']),
  connect(mapStateToProps, mapDispatchToProps))(Home)

