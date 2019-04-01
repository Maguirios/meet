import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { fetchUser } from "../redux/action-creators/usersActions";
import firebase from '../firebase'

class SingUp extends React.Component {
  constructor() {
    super();
    this.state = {
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleLogin(e) {
    // e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
    .then(data=> 
      this.props.history.push('/'))

  }

  render() {
    return (
      <form className="containerInputs" noValidate autoComplete="off">
        <TextField
          className="inputStyle"
          label="Email"
          margin="normal"
          type='email'
          name="email"
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

