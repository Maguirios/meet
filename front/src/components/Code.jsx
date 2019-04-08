import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import { connect } from 'react-redux'
import { setUser } from '../redux/action-creators/usersActions'
import { Link } from 'react-router-dom'
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

  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  buttonSendStyle: {
    width: 44,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#4dc2f1'
  },
  centerButton: {
    paddingTop: 25,
    paddingLeft: 27
  },
  containerInputs: {
    width: 600,
    height: 180,
    borderRadius: 5,
    boxShadow: '0 2px 20px 5px rgba(0, 0, 0, 0.2)',
    backgroundImage: 'linear-gradient(to bottom, #ffffff, #ffffff)',
    padding: 30
  },
  title: {
    marginLeft: 20,
    width: 500
  },
  text2: {
    marginLeft: 20,
    width: 400
  }
});
class Code extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      code: '',
      open: false,
      error: ''

    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeName = this.handleChangeName.bind(this)
    this.handleChangeCode = this.handleChangeCode.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  handleClose() {
    this.setState({ open: false });
  };

  handleSubmit(e) {
    e.preventDefault();
    const user = this.state.name
    if (this.state.name.replace(/\s/g, "") && this.state.code.replace(/\s/g, "")) {
      this.props.setUser(user)
      this.props.history.push(`/chat`)
    } else {
      try {
        throw new Error("required inputs");
      } catch (e) {
        var errorMessage = Error.message;
        this.setState({ error: errorMessage, open: true })
      }
    }
  }

  handleChangeName(event) {
    const value = event.target.value;
    this.setState({ name: value })

  }
  handleChangeCode(event) {
    const value = event.target.value;
    this.setState({ code: value })
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="center"
        >
          <form noValidate autoComplete="off" className={classes.containerInputs} >
            <div>
              <TextField
                value={this.state.code}
                label="Código de Video Conferencia"
                margin="normal"
                className={classes.title}
                onChange={this.handleChangeCode}
                type='number'
                helperText={this.state.code === "" ? 'campo obligatorio' : ''}
                onInput={(e) => {
                  e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 4)
                }}

              >
              </TextField>
            </div>
            <div>
              <Grid
                container
                alignItems="center"

              >
                <Grid
                  item sm
                >
                  <TextField
                    value={this.state.name}
                    label="Ingrese su nombre"
                    margin="normal"
                    className={classes.text2}
                    onChange={this.handleChangeName}
                    helperText={this.state.name === "" ? 'campo obligatorio' : ''}
                  >
                  </TextField>
                </Grid>
                <Grid
                  className={classes.centerButton}
                  item sm
                >
                  <Button variant="contained" size="small" color="primary" onClick={this.handleSubmit} className={classes.buttonSendStyle}>
                    <Icon>keyboard_arrow_right</Icon>
                  </Button>
                  <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">{"Debe completar ambos campos"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                       Para continuar debe ingresar los 4 digitos del codigo video conferencia y su nombre
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={this.handleClose} color="primary">
                        Aceptar
                    </Button>
                    </DialogActions>
                  </Dialog>

                </Grid>
              </Grid>

            </div>
          </form>
        </Grid>
      </div>
    );
  }
}

Code.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  userName: state.users.userName,

});
const mapDispatchToProps = (dispatch) => ({
  setUser: user => dispatch(setUser(user)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Code));

