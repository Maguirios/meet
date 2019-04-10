import React, { Component } from 'react';
import { compose } from 'redux'
import PropTypes from 'prop-types'
import { firebaseConnect } from 'react-redux-firebase'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { TextField } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  container: {
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
  }
})

export class UserRooms extends Component {


  render() {
    const { classes } = this.props
    return (
      <div>
        {this.props.rooms ?
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
                    >{room.time}
                    </p>
                    <p
                      className={classes.textDate}
                      margin="normal"
                    >{ room.date}
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
    console.log(room)
    return room.emails.some((user) => user === state.firebase.auth.email)
  })
})

const mapDispatchToProps = {

}

export default compose(firebaseConnect(['rooms']),
  connect(mapStateToProps, mapDispatchToProps))(withStyles(styles)(UserRooms))

