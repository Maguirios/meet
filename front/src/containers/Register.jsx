import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import firebase from '../firebase'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button1: {
    width: 110,
    height: 36,
    borderRadius: 5,
    backgroundColor: '##5c6f7b',
    textDecoration: 'none',
    marginRight: 5,
  },
  button2: {
    width: 110,
    height: 36,
    borderRadius: 5,
    backgroundColor: '#4dc2f1',
    marginLeft: 5,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
  buttonWrapper: {
    position: 'relative',
    marginBottom: theme.spacing.unit * 4,
  },
});

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      error: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
  }

  componentDidMount() {
    (this.props.currentUser) ? this.props.history.push('/') : null
  }

  componentDidUpdate(prevProps) {
    (prevProps.currentUser !== this.props.currentUser) ? this.props.history.push('/') : null
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        return firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      })
      .then(create => {
        firebase.auth().currentUser.updateProfile({
          displayName: this.state.userName
        })
          .then(() => {
            // Update successful.
            this.props.history.push('/')
          })
      })
      .catch((error) => {
        0.2
        if(error.code == 'auth/argument-error') this.setState({ error: 'Todos los campos son obligatorios', open: true })
        else if(error.code == 'auth/email-already-in-use') this.setState({ error: 'El email ingresado ya esta en uso', open: true })
        else if(error.code == 'auth/weak-password') this.setState({ error: 'La contraseña debe tener minimo 6 caracteres', open: true })
      });
  }
  handleClickOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;
    return (
      <form noValidate autoComplete="off" className='containerInputs' onSubmit={this.handleSubmit}>
        <TextField
          label="Nombre de Usuario"
          className='inputStyle'
          margin="dense"
          name="userName"
          onChange={this.handleChange}
        />
        <TextField
          id="standard"
          label="Email"
          className='inputStyle'
          margin="dense"
          type="email"
          name="email"
          autoComplete="email"
          onChange={this.handleChange}
        />
        <TextField
          id="standard-password-input"
          label="Contraseña"
          className='inputStyle'
          type="Password"
          autoComplete="current-password"
          margin="normal"
          name="password"
          onChange={this.handleChange}
        />

        <div>
        <Link to='/' ><Button variant="contained" className={classes.button1}>Cancelar</Button></Link>
        <Button variant="contained" color="primary" className= {classes.button2} type='submit'>
          Registrarse
        </Button>
        </div>
        <Dialog
          open={this.state.open && this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Error'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.error && this.state.error}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Register);