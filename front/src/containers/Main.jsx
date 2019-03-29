import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Home from './home';
import * as moment from 'moment';


class Main extends Component {
  
  render() {
    let time = 0;
    const update = () =>{
      time = moment().format('LT')
    }
    setInterval(function(){
      update();
   },6);
    const { classes } = this.props;
    return (
      <div className='home'>
        <div className='home-top'>
          <Button variant="contained" color="primary">
            INICIAR SESIÓN
          </Button>

          <Button variant="contained" color="primary" id='register'>
            REGISTRARSE
          </Button>
        </div>
        <div className='home-center'>
          <img className='isologo-horizontal-white' src='/utils/images/logor.png' />
          <div className="components"></div>
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

