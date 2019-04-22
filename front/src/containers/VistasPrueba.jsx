import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class Prueba extends React.Component {
  // constructor(props){
  //   super(props)
  //   this.state = {

  //   }
  // }
  render() {
    const {classes} = this.props
    return (
      <div className='prueba'>
        <div className="hola">HOLA</div>
        <div className="hola">HOLA</div>
        <div className="hola">HOLA</div>
        <div className="hola">HOLA</div>
        <div className="hola">HOLA</div>
        <div className="hola">HOLA</div>
        <div className="hola">HOLA</div>
        <div className="hola">HOLA</div>
        <List className={classes.root}>
          
        </List>
      </div>
    )
  }
}
Prueba.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Prueba);