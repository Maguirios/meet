import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import * as moment from 'moment';
import RegisterContainer from './Register'

import Code from '../components/Code';
import Chat from '../components/Chat';
import SignIn from "./SignIn"
import Permisos from './Permisos';
import Conexion from './Conexion'
import SalaEspera from './SalaEspera'
import firebase from '../firebase';
import CreateRoom from './createRoom';

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      time: moment().format('LT'),
    }
    this.signOut = this.signOut.bind(this)
    this.update = this.update.bind(this)
  }
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })
      }
    });

    let db = firebase.database().ref('rooms')
     
     db.on('value', snapshoot => {
         console.log(Object.values(snapshoot.val()).filter((room) => (
             room.emails.some((user) => user === this.state.user.email)
         )))
     })

    setInterval(this.update, 5000);
  }

  signOut() {
    firebase.auth().signOut()
      .then(() => {
        this.setState({ user: {} })
      }).catch(function (error) {
        console.log('El error fue', error)
      });
  }
  update() { this.setState({ time: moment().format('LT') }) };
  render() {

    const { classes } = this.props;
    return (
      <div className='home'>
        <div className='home-top'>
          {(this.state.user.email) ?
            <div className="withUser">
              <Link to='/createRoom'>
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
          }
        </div>
        <div className='home-center'>
          <img className='isologo-horizontal-white' src='/utils/images/logor.png' />
          <div className="components">
            <Route path='/permisos' render={() => <Permisos />} />
            <Route path='/conexion' render={() => <Conexion />} />
            <Route path='/salaespera' render={() => <SalaEspera />} />
            <Route path='/chat' component={Chat} />
            <Route path='/register' render={({ history }) => <RegisterContainer history={history} currentUser={this.state.user} />} />
            <Route path='/signIn' render={({ history }) => <SignIn history={history} currentUser={this.state.user} />} />
            <Route path='/createroom' render={({ history }) => <CreateRoom history={history} currentUser={this.state.user} />} />
            <Route exact path='/' component={Code} />
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

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, null)(Main);

