import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import firebase from '../firebase'
import axios from 'axios'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  icon: {
    height: 75,
    width: 75,
    objectFit: 'contain',
    roomCode: '',
    roomTitle: '',
    date: '',
    time: ''
  },
  iconButton: {
    marginTop: 15,
    float: 'right'
  },
  headerUpload: {
    display: 'grid',
    'grid-template-columns': '2fr 1fr'
  },
  titleUpload: {
    marginLeft: 20,
    width: 150,
    height: 19,
    fontFamily: 'Roboto',
    fontSize: 14,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#8d9aa3',
  },
  cancelContainer: {
    display: 'grid',
    justifyItems: 'end'
  },
  cancel: {
    fontFamily: 'Nunito',
    width: 15,
    height: 15,
    color: '#8d9aa3',
    margin: 10,
  },
  enviar: {
    display: 'grid',
    justifyItems: 'center'
  },
  button: {
    backgroundColor: '#4dc2f1',
  }
});

export class AddParticipant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      roomCode: '',
      countEmails: []
    }
    this.handleClose = this.handleClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleChange = this.handleChange.bind(this);
  };

  componentDidMount() {
    firebase.database().ref(`/rooms/${this.props.dataSala}`).on("value", (snapshot) => {
      this.setState({ countEmails: snapshot.val().emails, roomTitle: snapshot.val().name, date: snapshot.val().date, roomCode: snapshot.val().code })
    })
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault();
    const addEmails = this.state.countEmails.concat(this.state.email.replace(/\s/g, "").split(','))
    firebase.database().ref(`rooms/${this.props.dataSala}/emails/`)
      .set(addEmails)

    this.setState({ open: false })

    var template_content = [
      { "name": "guestName", "content": 'Hola' },
      { "name": "guestEmail", "content": 'plataforma@mail' },
      { "name": "roomCode", "content": this.state.roomCode },
      { "name": "roomTitle", "content": this.state.roomTitle },
      { "name": "roomDate", "content": this.state.date + ' ' + ' hs' },
      { "name": "ownerName", "content": this.state.name },
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
            "content": 'http://localhost:3000/'
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


  handleClickOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };


  render() {
    const { dataSala, classes } = this.props
    return (
      <div>

        <Button id='add-participant' onClick={this.handleClickOpen}>
          <img src="/utils/images/add-participant.svg" />
        </Button>
        <form autoComplete="off" >
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <div className={classes.headerUpload}>
              <p className={classes.titleUpload}>ENVIAR INVITACIÓN</p>
              <div className={classes.cancelContainer}>
                <IconButton onClick={this.handleClose} aria-label="Close" className={classes.closeButton} >
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Nombre"
                name='name'
                type="name"
                fullWidth
                onChange={this.handleChange}
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                name='email'
                type="email"
                fullWidth
                onChange={this.handleChange}
              />
            </DialogContent>
            <div className={classes.enviar}>
              <DialogActions >
                <Button onClick={(e) => this.handleSubmit(e)} className={classes.button} variant="contained" color='primary' component="span" >ENVIAR INVITACIÓN</Button>
              </DialogActions>
            </div>
          </Dialog>
        </form>
      </div>
    );
  }
}

AddParticipant.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddParticipant));