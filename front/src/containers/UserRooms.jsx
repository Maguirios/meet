import React, { Component } from 'react';
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { firebaseConnect } from 'react-redux-firebase'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';

const styles = theme => ({
  container: {
    width: 600,
    maxHeight: 190,
    borderRadius: 5,
    padding: 30,
    boxShadow: '0px 2px 20px 5px rgba(0, 0, 0, 0.2)',
    backgroundColor: 'white',
    overflowY: 'scroll',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: 1,
  } ,
  },
  rooms: {
    width: 600,
    heigth: 90,
  },
  textRoom: {
    fontSize: 18,
    fontWeight: 900,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#5c6f7b',
  },
  textDate: {
    fontSize: 12,
    fontWeight: 900,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#8d9aa3',
    margin: 5,
  },
  centerButton: {
    width: 44,
    height: 30,
    float: 'right',
  },
  progress:{
    width: 50,
    heigth: 50,
  }, 
  noRooms:{
    fontFamily: 'Roboto',
    textAlign: 'center',
    fontSize: 18
  }
})

export class UserRooms extends Component {


  render() {
    const { classes } = this.props
    return (
      <div>
        {this.props.rooms ?
         this.props.rooms.length != 0 ? 
        <Grid
          className={classes.container}
          container
          direction="row"
          justify="center"
          align='center'
        >
            {this.props.rooms.map(room => (
              <div key={room.code} className={classes.rooms}>
                <Grid
                  container
                  alignItems="center"
                >
                  <Grid
                    item sm
                  >
                    <p
                      className={classes.textDate}
                      margin="normal"
                    >{room.date}
                    </p>
                  </Grid>
                  <Grid
                    item sm
                  >
                    <p
                      className={classes.textRoom}
                      margin="normal"
                    >{room.name}
                    </p>
                  </Grid>
                  <Grid
                    className={classes.centerButton}
                    item sm
                  >
                    <Link to={`/room/${room.code}`}>
                      <Button variant="contained" size="small" color="primary" >
                        <Icon>keyboard_arrow_right</Icon>
                      </Button>
                    </Link>
                  </Grid>
                </Grid>
                <Divider />
              </div>
            ))}
        </Grid>
        : 
        <div className={classes.container}>
        <p className = {classes.noRooms} >No tiene ninguna sala activa</p>
        </div>
          :
          <CircularProgress className={classes.progress} color="secondary" />
      }
      </div>
    )
  }
}

UserRooms.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  userLogin: state.firebase.auth,
  rooms: state.firebase.data.rooms && Object.values(state.firebase.data.rooms).filter((room) => {
    return room.emails.some((user) => user === state.firebase.auth.email) 
    && room.status === 'active'
    && moment().startOf('date').isSameOrBefore(moment(room.dia ,"DD-MMMM-YYYY"))
    // && Number(room.date.slice(20,22)-2 < Number(moment().format('HH')))
  })
})

const mapDispatchToProps = {

}

export default compose(firebaseConnect(['rooms']),
  connect(mapStateToProps, mapDispatchToProps))(withStyles(styles)(UserRooms))

