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
    width: 528,
    //height: 380,
    borderRadius: 5,
    boxShadow: '0 2 20 5 rgba(0, 0, 0, 0.2)',
    backgroundColor: 'white'
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
    height: 36,
    borderRadius: 5,
    backgroundColor: '##5c6f7b',
    textDecoration: 'none',
  },
  button2: {
    width: 110,
    height: 36,
    borderRadius: 5,
    backgroundColor: '#4dc2f1',
  },
  text: {
    fontFamily: 'Roboto',
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
    marginBottom: 10
  },
  title: {
    fontFamily: 'Roboto',
    fontWeight: 900,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#5c6f7b',
    width: 528

  },
  roomCreated: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 0,
    marginTop: 40
  },
  invitation: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 2,
    marginBottom: 40
  },
  code: {
    textAlign: 'center',
    fontSize: 12,


  },
  codeNumber: {
    textAlign: 'center',
    fontSize: 28,
    margin: 0,
    marginBottom: 20
  },
  link: {
    textDecoration: 'none'
  }
})
moment.locale("es");




export class createRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDate: moment(),
      room: '',
      email: '',
      created: false,
      roomCode: 0,
      dia: moment().format('LL')[1] === ' ' ? '0' + moment().format('LL').slice(0, 19).replace(' de ', '-').replace(' de ', '-') : moment().format('LL').slice(0, 19).replace(' de ', '-').replace(' de ', '-')
    };
  }

  componentDidMount() {
    (this.props.currentUser.isEmpty) ? this.props.history.push('/') :
      firebase.database().ref(`/rooms/`).on('value', snapshoot => {
        this.setState({ rooms: Object.keys(snapshoot.val()) })
      })
  }

  handleDateChange(date) {
    this.setState({
      selectedDate: date,
      dia: date.format('LL')[1] === ' ' ? '0' + date.format('LL').slice(0, 19).replace(' de ', '-').replace(' de ', '-') : date.format('LL').slice(0, 19).replace(' de ', '-').replace(' de ', '-')
    });
  };

  handleTimeChange(time) {
    this.setState({ selectedDate: time,
      dia: time.format('LL')[1] === ' ' ? '0' + time.format('LL').slice(0, 19).replace(' de ', '-').replace(' de ', '-') : time.format('LL').slice(0, 19).replace(' de ', '-').replace(' de ', '-')
     });
  }
  handleEmail(e) {
    this.setState({ email: e.target.value })
  }

  handleRoom(e) {
    this.setState({ room: e.target.value })
  }

  genRoomCode() {
    let roomCode = Math.floor(1000 + Math.random() * 9000);
    if (this.state.rooms.includes(roomCode)) {
      return genRoomCode()
    }
    return roomCode
  }

  handleSubmit(e) {
    e.preventDefault();
    let roomCode = this.genRoomCode()
    let fullDate = this.state.selectedDate.format('LLL')[1] === ' ' ? '0' + this.state.selectedDate.format('LLL') : this.state.selectedDate.format('LLL')
    let newRoom = {
      code: roomCode,
      name: this.state.room,
      emails: this.state.email.replace(/\s/g, "").split(',').concat(this.props.currentUser.email),
      date: fullDate,
      status: 'active',
      dia: this.state.dia,
    }
    firebase.database().ref(`rooms/${roomCode}`).set(newRoom)
      .catch(err => {
        console.log('err', err)
      })
    this.setState({ created: true })
    this.setState({ roomCode })
    
    if (this.state.email) {
      var template_content = [
        { "name": "guestName", "content": 'Hola' },
        { "name": "guestEmail", "content": 'plataforma@mail' },
        { "name": "roomCode", "content": roomCode },
        { "name": "roomTitle", "content": this.state.room },
        { "name": "roomDate", "content": this.state.selectedDate.format('LLL') + ' hs' },
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
  }


  render() {
    const { classes } = this.props
    const { selectedDate, selectedTime } = this.state;

    const create = (
      <Grid
        container
        direction='row'
      >
        <form className={classes.createRoom} style={{ 'paddingLeft': '40px', 'paddingBottom': '20px', 'paddingTop': '28px' }}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <Grid
              item sm>
              <p className={classes.text}>SALA</p>
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
                value={selectedDate}
                onChange={time => this.handleTimeChange(time)}
              />
            </Grid>
          </MuiPickersUtilsProvider>
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
          <Grid className={classes.buttons} container spacing={24}>
            <Grid item>
              <Link to='/' className={classes.link}><Button variant="contained" className={classes.button1}>Cancelar</Button></Link>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" onClick={(e) => this.handleSubmit(e)} className={classes.button2}>Crear</Button>
            </Grid>
          </Grid>
        </form>
      </Grid>)

    const created = (
      <div className={classes.createRoom}>
        <Grid container>
          <Grid>
            <p className={classes.title + ' ' + classes.roomCreated}>La sala fue creada exitosamente</p>
            <p className={classes.title + ' ' + classes.invitation}> y las invitaciones fueron enviadas.</p>

            <p className={classes.title + ' ' + classes.code}>CODIGO</p>
            <p className={classes.title + ' ' + classes.codeNumber}>{this.state.roomCode}</p>
          </Grid>
          <Grid className={classes.buttons} container spacing={24}>
            <Grid item>
              <Link to='/' className={classes.link}><Button variant="contained" className={classes.button1}>VOLVER</Button></Link>
            </Grid>
            <Grid item>
              <Link to={`/room/${this.state.roomCode}`} className={classes.link} ><Button variant="contained" color="primary" className={classes.button2}>INGRESAR</Button></Link>
            </Grid>
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
