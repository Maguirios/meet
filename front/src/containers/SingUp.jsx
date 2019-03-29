import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { fetchUser } from "../redux/action-creators/usersActions";

const styles = theme => ({
  button: {
    backgroundColor: "#4dc2f1"
  }
});

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
    this.props.fetchUser(this.state);
  }

  render() {
    return (
      <form className="containerInputs" noValidate autoComplete="off">
        <TextField
          className="inputStyle"
          //   id="standard-name"
          label="EMAIL"
          margin="normal"
          name="email"
          onChange={this.handleLogin}
        />

        <TextField
          className="inputStyle"
          //   id="standard-uncontrolled"
          label="PASSWORD"
          margin="normal"
          name="password"
          onChange={this.handleLogin}
        />

        <Button
          onClick={this.handleSubmit}
          variant="contained"
          color="primary"
          className="button"
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
// export default withStyles(styles)(SingUp);
