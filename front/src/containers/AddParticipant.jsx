import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from '../firebase'

import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
  icon: {
    height: 75,
    width: 75,
    objectFit: 'contain',
  },

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
    firebase.database().ref(`rooms/3361/emails/`).on("value", (snapshot) => {
      console.log('El arreglo de emails', snapshot.val());
      this.setState({ countEmails: snapshot.val() })
    })

  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })

  }

  handleSubmit(e) {
    e.preventDefault();

    this.state.countEmails.push(this.state.email)
    console.log('el estado local', this.state)

    // let addEmail = this.state.countEmails.concat(this.state.email)

    console.log('HHHHHHH', this.state.countEmails)
    // firebase.database().ref(`rooms/3361/emails`)
    //     .set(addEmail)

    //     this.setState({ open: false })



    // console.log('FIREBASE DATA', this.props)
  }


  handleClickOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };


  render() {
    const { dataSala } = this.props
    const { classes } = this.props
    const hola = this.props

    console.log('Hola', hola)
    return (
      <div style={{ display: 'inline' }}>

        <Button id='add-participant' onClick={this.handleClickOpen} style={{ float: 'right', marginTop: '12px' }}>
          <img src="/utils/images/add-participant.svg" className={classes.icon} />
        </Button>
        <form autoComplete="off" >
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">ENVIAR INVITACIÓN</DialogTitle>
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
            <DialogActions >
              <Button onClick={this.handleClose} color="primary">CANCEL</Button>
              <Button onClick={(e) => this.handleSubmit(e)} color="primary" >ENVIAR INVITACIÓN</Button>
            </DialogActions>
          </Dialog>
        </form>

      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  userName: state.users.userName
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddParticipant));