import React from 'react';
import PropTypes from 'prop-types';
import {TextField} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';


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
  }
});


class Code extends React.Component {

  render() {
    const { classes } = this.props;

    return (


      <form noValidate autoComplete="off" id='containerInputsCode' className='code'>
        <div>
        <Input
          id="title"
          label="Código de Video Conferencia"
          margin="normal"
          disableUnderline = {true}
        />
        </div>
        <div className='code2darow'>
        <TextField
          id="text2"
          label="Ingrese su nombre"
          margin="normal"
          variant = 'filled'
        />
          <Button variant="contained" size="small" color="primary" id= 'buttonSendStyle'>
            <Icon>send</Icon>
          </Button>
        </div>
      </form>

    );
  }
}

Code.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Code);