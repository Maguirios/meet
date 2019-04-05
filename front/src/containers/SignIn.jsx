import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { fetchUser } from "../redux/action-creators/usersActions";
import firebase from '../firebase'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class SingUp extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      error: ''
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
  }

  componentDidMount() {
    (this.props.currentUser.email)? this.props.history.push('/') : null
  }

  componentDidUpdate(prevProps){
    (prevProps.currentUser.email !== this.props.currentUser.email)? this.props.history.push('/') : null
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
  render() {
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
          label="Password"
          margin="normal"
          name="password"
          type='password'
          onChange={this.handleLogin}
        />

        <Button
          onClick={this.handleSubmit}
          variant="contained"
          color="primary"
          className="buttonsStyle"
        >
          {" "}
          Ingresar{" "}
        </Button>
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
const mapStateToProps = state => {
  return {
    user: state.users.LogUser.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchUser: user => dispatch(fetchUser(user))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingUp);

