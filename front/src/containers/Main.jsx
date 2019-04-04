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

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {}
    }
    this.signOut = this.signOut.bind(this)
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user })
      }
    });
  }
  signOut() {
    firebase.auth().signOut()
    .then(() => {
      this.setState({ user: {} })
    }).catch(function (error) {
      console.log('El error fue', error)
    });
  }
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
    console.log('estadoooo', this.state)
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
            <Route exact path='/permisos' render ={()=> <Permisos />}/>
            <Route exact path='/conexion' render ={() => <Conexion />}/> 
            <Route exact path='/salaespera' render ={()=> <SalaEspera />}/>
            <Route exact path='/chat' component={Chat} />
            <Route exact path='/register' render={({ history }) => <RegisterContainer history={history} currentUser={this.state.user} />} />
            <Route exact path='/signIn' render={({ history }) => <SignIn history={history} currentUser={this.state.user}/>} />
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

