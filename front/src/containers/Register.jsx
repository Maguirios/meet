import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'
import { createUserFn } from '../redux/action-creators/usersActions'
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

const inlineStyles = {
  anchorVertical: {
    top: {
      top: -5,
    },
    center: {
      top: 'calc(50% - 5px)',
    },
    bottom: {
      bottom: -5,
    },
  },
  anchorHorizontal: {
    left: {
      left: -5,
    },
    center: {
      left: 'calc(50% - 5px)',
    },
    right: {
      right: -5,
    },
  },
};

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

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  handleSubmit(e) {
    e.preventDefault()
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function () {
        return firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      })
      .then(create => {
        this.props.history.push('/')
      })
      .catch((error) => {
        0.2
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('El codigo de error es', errorCode, ' y el mensaje es: ', errorMessage)
        this.setState({ error: errorMessage, open: true })
      });
  }
  handleClickOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  componentDidUpdate() {

  }

  render() {
    const { classes } = this.props;

    return (
      <form noValidate autoComplete="off" className='containerInputs' onSubmit={this.handleSubmit}>
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
          label="Password"
          className='inputStyle'
          type="Password"
          autoComplete="current-password"
          margin="normal"
          name="password"
          onChange={this.handleChange}
        />
        <Button variant="contained" color="primary" className='buttonsStyle' type='submit'>
          Registrarse
        </Button>
        <Dialog
          open={this.state.open}
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