import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { fetchUser } from "../redux/action-creators/usersActions";
import firebase from '../firebase'
import { Link } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const styles = theme => ({
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
  }
})
class SingUp extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      error: '',
      password: '',
      email: ''
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
  }

  componentDidMount() {
    (this.props.currentUser)? this.props.history.push('/') : null
  }

  componentDidUpdate(prevProps){
    (prevProps.currentUser !== this.props.currentUser)? this.props.history.push('/') : null
  }


  handleLogin(e) {
    // e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(data => this.props.history.push('/'))
      .catch((error) => {
        0.2
        var errorCode = error.code;
        var errorMessage = error.message;
        if(error.code == 'auth/invalid-email') this.setState({ error: 'El email no ha sido ingresado o tiene un formato incorrecto', open: true })
        else if(error.code == 'auth/wrong-password') this.setState({ error: 'La combinacion de email y contraseña ingresada es incorrecta o no ha ingresado una contraseña', open: true })
        else if(error.code == 'auth/user-not-found') this.setState({ error: 'El email ingresado no corresponde a un usuario creado', open: true })
        else if(error.code == 'auth/user-not-found') this.setState({ error: 'El email ingresado no corresponde a un usuario creado', open: true })
        console.log('El codigo de error es', errorCode, ' y el mensaje es: ', errorMessage)

      });
  }
  handleClickOpen() {
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props
    return (
      <form className="containerInputs" noValidate autoComplete="off">
        <TextField
          className="inputStyle"
          label="Email"
          margin="normal"
          type='email'
          name="email"
          autoComplete='email'
          onChange={this.handleLogin}
        />

        <TextField
          className="inputStyle"
          label="Contraseña"
          margin="normal"
          name="password"
          type='password'
          onChange={this.handleLogin}
        />
        <div>
        <Link to='/' ><Button variant="contained" className={classes.button1}>Cancelar</Button></Link>
        <Button
          onClick={this.handleSubmit}
          variant="contained"
          color="primary"
          className={classes.button2}
        >
          {" "}
          Ingresar{" "}
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

SingUp.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SingUp));
