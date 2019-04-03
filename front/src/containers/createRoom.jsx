import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid'
import moment from "moment";
import { InlineDatePicker, TimePicker, MuiPickersUtilsProvider } from "material-ui-pickers";
import MomentUtils from "@date-io/moment";
import "moment/locale/es";


const styles = theme => ({
  createRoom: {
    width: 528,
    height: 290,
    borderRadius: 5,
    boxShadow: '0 2 20 5 rgba(0, 0, 0, 0.2)',
    backgroundColor: 'white',
    paddingLeft: 40,
  },
  outlinedSala: {
    padding: 0,
    width: 245,
    height: 32,
    marginRight: 10,
    border: 2,
    borderRadius: 5,
  },
  outlinedFecha: {
    padding: 0,
    width: 92,
    height: 32,
    marginRight: 10,
    border: 2,
    borderRadius: 5,
  },
  outlinedHora: {
    padding: 0,
    width: 68,
    height: 32,
    border: 2,
    borderRadius: 5,
  },
  outlinedEmailInput: {
    width: 435,
    height: 32,
    border: 2,
    borderRadius: 5,
  },
  button1: {
    width: 110,
    height: 32,
    borderRadius: 5,
    backgroundColor: '##5c6f7b',
  },
  button2: {
    width: 110,
    height: 32,
    borderRadius: 5,
    backgroundColor: '#4dc2f1',
  }, 
  text: {
    fontFamily: 'Avenir',
    fontSize: 12,
    fontWeight: 500,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#8d9aa3',
  },
  buttons:{
    justifyContent: "center",
    margin: '0 auto',
  }
})
moment.locale("es");




export class createRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDate: new Date(),
      selectedTime: new Date(),
    };
  }

  handleDateChange(date) {
    console.log(date)
    this.setState({ selectedDate: date });
  };

  handleTimeChange(time) {
    console.log(time)
    this.setState({ selectedTime: time });
  }

  render() {
    const { classes } = this.props
    const { selectedDate, selectedTime } = this.state;
    return (
      <div>
        <Grid
          container
          direction='row'
        >
          <form className={classes.createRoom}>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <Grid
                item sm>
                <p className={classes.text}>SALA</p>
                <TextField
                  className={classes.outlinedSala}
                  label="Nombre de la Sala"
                  margin="normal"
                  variant="outlined"
                />
                <InlineDatePicker
                  onlyCalendar
                  className={classes.outlinedFecha}
                  label="Fecha"
                  margin="normal"
                  variant="outlined"
                  value={selectedDate}
                  onChange={date => this.handleDateChange(date)}
                />
                <TimePicker
                  autoOk
                  className={classes.outlinedHora}
                  label="Hora"
                  margin="normal"
                  variant="outlined"
                  value={selectedTime}
                  onChange={time => this.handleTimeChange(time)}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <Grid
              item sm>
              <p className={classes.text}>INVITADOS</p>
              <TextField
                className={classes.outlinedEmailInput}
                label="E-mail"
                type="email"
                name="email"
                autoComplete="email"
                margin="normal"
                fullWidth
                variant="outlined"
              />
              <p className={classes.text}>Agregar otro invitado</p>
            </Grid>
            <Grid className={classes.buttons} container sm spacing={24}>
             <Grid item>
              <Button variant="contained" className={classes.button1}>Cancelar</Button>
             </Grid>
             <Grid item>
              <Button variant="contained" color="primary" className={classes.button2}>Crear</Button>
             </Grid>
            </Grid>
          </form>
        </Grid>
      </div>
    )
  }
}

createRoom.propTypes = {
  classes: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default withStyles(styles)(createRoom)
