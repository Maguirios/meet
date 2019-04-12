import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import moment from "moment";
import { InlineDatePicker, TimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import MomentUtils from "@date-io/moment";
import firebase from '../firebase';
import "moment/locale/es";
import axios from 'axios'



const styles = theme => ({
  createRoom: {
    width: 560,
    height: 380,
    borderRadius: 5,
    boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.2)',
    backgroundColor: 'white',
    display: 'grid',
    'grid-template-rows': '1fr 2fr 1fr 2fr 1fr 2fr',
    justifyItems: 'center',
    alignItems: 'center',
    padding: '10px 0px'
  },
  outlinedSala: {
    width: 245,
    height: 53,
  },
  outlinedFecha: {
    padding: 0,
    width: 92,
    height: 53,
    marginRight: 10,
    border: 2,
    borderRadius: 5,
  },
  outlinedHora: {
    padding: 0,
    width: 68,
    height: 53,
    border: 2,
    borderRadius: 5,
  },
  outlinedEmailInput: {
    width: 435,
    height: 53,
    border: 2,
    borderRadius: 5,
  },
  button1: {
    width: 110,
    height: 53,
    borderRadius: 5,
    backgroundColor: '##5c6f7b',
  },
  button2: {
    width: 110,
    height: 53,
    borderRadius: 5,
    backgroundColor: '#4dc2f1',
  },
  text: {
    fontFamily: 'Avenir',
    fontSize: 12,
    fontWeight: 500,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#8d9aa3',
  },
  buttons: {
    justifyContent: "center",
    margin: '0 auto',
  },
  topContainer: {
    margin: '0 auto'
  },
  top: {
    display: 'grid',
    'grid-template-columns': '3fr 1fr 1fr',
    justifyItems: 'center'
  },
  middle: {
    display: 'grid',
    justifyItems: 'center'
  },
  buttom: {
    display: 'grid',
    'justify-items': 'center',
    'grid-template-columns': '1fr 1fr',
    'grid-column-gap': '27px',
    'margin-bottom': '10px',
  },
  texts: {
    display: 'grid',
    justifyItems: 'start',
    width: '100%',
    paddingLeft: 120,
  }
})
moment.locale("es");




export class createRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDate: moment(),
      selectedTime: moment(),
      room: '',
      email: '',
      created: false,
      roomCode: 0,
    };
  }

  handleDateChange(date) {
    console.log(date)
    this.setState({ selectedDate: date });
  };

  handleTimeChange(time) {
    console.log(time)
    this.setState({ selectedTime: time });
  }
  handleEmail(e) {
    this.setState({ email: e.target.value })
  }

  handleRoom(e) {
    this.setState({ room: e.target.value })
  }
  handleSubmit(e) {
    e.preventDefault();
    let roomCode = Math.floor(1000 + Math.random() * 9000);
    let newRoom = {
      code: roomCode,
      name: this.state.room,
      emails: this.state.email.replace(/\s/g, "").split(',').concat(this.props.currentUser.email),
      time: this.state.selectedTime.format('LT'),
      date: this.state.selectedDate.format('LL'),
    }
    firebase.database().ref(`rooms/${roomCode}`).set(newRoom)
      .catch(err => {
        console.log('err', err)
      })
    this.setState({ created: true })
    this.setState({ roomCode })

    var template_content = [
      { "name": "guestName", "content": 'Hola' },
      { "name": "guestEmail", "content": 'plataforma@mail' },
      { "name": "roomCode", "content": roomCode },
      { "name": "roomTitle", "content": this.state.room },
      { "name": "roomDate", "content": this.state.selectedDate.format('LL') + ' ' + this.state.selectedTime.format('LT') + ' hs' },
      { "name": "ownerName", "content": this.props.currentUser.displayName },
      { "name": "ownerEmail", "content": 'owner@gmail.com' }
    ]

    var emails = this.state.email.replace(/\s/g, "").split(',')

    const params = {
      message: {
        to: [],
        from_email: 'no-reply@insideone.com.ar',
        from_name: 'Meet',
        subject: `Videollamada`,
        "global_merge_vars": [
          {
            "name": "LINK",
            "content": `http://localhost:3000/room/${roomCode}`
          },
          {
            "name": "participants",
            "content": emails
          },
          {
            "name": "hasParticipants",
            "content": true
          }
        ]

      },
      template_name: 'meeting-invite',
      template_content
    }

    emails.map(userEmail => {
      params.message.to.push({ email: userEmail })

    })

    axios.post('/api/sendEmail', params)
      .then(email => {
        console.log(email)
      })
  }


  render() {
    const { classes } = this.props
    const { selectedDate, selectedTime } = this.state;

    const create = (
      <form className={classes.createRoom}>
        <div className={classes.texts}>
          <p className={classes.text}>SALA</p>
        </div>
        <div className={classes.top}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <TextField
              className={classes.outlinedSala}
              label="Nombre de la Sala"
              margin="normal"
              variant="outlined"
              onChange={(e) => this.handleRoom(e)}
            />
            <InlineDatePicker
              onlyCalendar
              className={classes.outlinedFecha}
              label="Fecha"
              margin="normal"
              variant="outlined"
              value={selectedDate}
              onChange={date => this.handleDateChange(date)}
            />
            <TimePicker
              autoOk
              className={classes.outlinedHora}
              label="Hora"
              margin="normal"
              variant="outlined"
              value={selectedTime}
              onChange={time => this.handleTimeChange(time)}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div className={classes.texts}>
          <p className={classes.text}>INVITADOS</p>
        </div>
        <div className={classes.middle}>
          <TextField
            className={classes.outlinedEmailInput}
            label="E-mail"
            type="email"
            name="email"
            autoComplete="email"
            margin="normal"
            fullWidth
            variant="outlined"
            onChange={(e) => this.handleEmail(e)}
          />
        </div>
        <div className={classes.texts}>
          <p className={classes.text}>Agregar otro invitado</p>
        </div>
        <div className={classes.buttom}>
          <Link to='/' ><Button variant="contained" className={classes.button1}>Cancelar</Button></Link>
          <Button variant="contained" color="primary" onClick={(e) => this.handleSubmit(e)} className={classes.button2}>Crear</Button>
        </div>
      </form >
    )

    const created = (
      <div className={classes.createRoom}>
        <Grid>
          <p className={classes.text}>La sala fue creada exitosamente {'\n'} y las invitaciones fueron enviadas.</p>

          <p className={classes.text}>CODIGO{this.state.roomCode}</p>
          <p className={classes.text}>{this.state.roomCode}</p>
        </Grid>
        <Grid className={classes.buttons} container spacing={24}>
          <Grid item>
            <Link to='/' ><Button variant="contained" className={classes.button1}>VOLVER</Button></Link>
          </Grid>
          <Grid item>
            <Link to={`/room/${this.state.roomCode}`} ><Button variant="contained" color="primary" className={classes.button2}>INGRESAR</Button></Link>
          </Grid>
        </Grid>
      </div>
    )

    return (
      <div>
        {this.state.created ? created : create}
      </div>
    )
  }
}

createRoom.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default withStyles(styles)(createRoom)
