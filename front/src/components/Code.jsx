import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';


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

  render() {
    const { classes } = this.props;

    return (
      <div>

        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <form noValidate autoComplete="off" className={classes.containerInputs}>
            <div>
              <TextField

                label="Código de Video Conferencia"
                margin="normal"
                className={classes.title}
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
                    label="Ingrese su nombre"
                    margin="normal"
                    className={classes.text2}
                  >
                  </TextField>
                </Grid>
                <Grid
                  className={classes.centerButton}
                  item sm
                  alignItems="center"
                >
                  <Button variant="contained" size="small" color="primary" className={classes.buttonSendStyle}>
                    <Icon>send</Icon>
                  </Button>
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

export default withStyles(styles)(Code);