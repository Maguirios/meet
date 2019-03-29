import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux'
import { createUserFn } from '../redux/action-creators/usersActions'
import firebase from '../firebase'

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
});

class Register extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(e) {
    console.log('hola estoy en el handle change')
    this.setState({ [e.target.name]: e.target.value })
  }
  handleSubmit(e) {
    e.preventDefault()
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(function (error) {0.2
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log('El codigo de error es', errorCode, ' y el mensaje es: ', errorMessage)
      });
  }
  render() {
    console.log(this.state)
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
      </form>
    );
  }
}

Register.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
  createUserFn: (user) => dispatch(createUserFn(user))
}

export default connect(null, mapDispatchToProps)(withStyles(styles)(Register));