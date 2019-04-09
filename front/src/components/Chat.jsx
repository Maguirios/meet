import React from 'react';
import firebase from '../firebase';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';


const styles = theme => ({
<<<<<<< HEAD
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    color: 'white'
  },
  Field: {
    width: 200,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 5
  },
  inputField: {
    width: 200,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingLeft: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5
  },
  text: {
    width: 69,
    height: 16,
    fontFamily: 'Avenir',
    fontSize: 12,
    fontWeight: 500,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#ffffff'
  },
  name: {
    width: 45,
    height: 12,
    fontFamily: 'Avenir',
    fontSize: 9,
    fontWeight: 900,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#8d9aa3'
  },
  hora: {
    width: 69,
    height: 16,
    fontFamily: 'Avenir',
    fontSize: 12,
    fontWeight: 500,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#ffffff',
    marginLeft: 75
  },
  container: {
    maxHeight: 200,
    width: 235,
    overflowY: 'scroll',
    overflowX: 'hidden'
  },
  enviar: {
    margin: theme.spacing.unit,
    width: 34,
    height: 12,
    fontFamily: 'Avenir',
    fontSize: 9,
    fontWeight: 900,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#8d9aa3',
    paddingLeft: 55

  }
=======
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    input: {
        color: 'white'
    },
    Field: {
        display: 'grid',
        'grid-auto-rows': 'minmax(30px, auto) ',
        width: 200,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingLeft: 15,
        paddingTop: 15,
        paddingBottom: 15,
        marginBottom: 5
    },
    inputField: {
        width: 200,
        borderRadius: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 5
    },
    text: {
        width: 180,
        fontFamily: 'Avenir',
        fontSize: 12,
        fontWeight: 500,
        fontStyle: 'normal',
        fontStretch: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#ffffff', 
        'word-break':'break-all'
    },
    name: {
        fontFamily: 'Avenir',
        fontSize: 9,
        fontWeight: 900,
        fontStyle: 'normal',
        fontStretch: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#8d9aa3'
    },
    hora: {
        height: 16,
        fontFamily: 'Avenir',
        fontSize: 12,
        fontWeight: 500,
        fontStyle: 'normal',
        fontStretch: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#ffffff'
    },
    container: {
        maxHeight: 200,
        width: 235,
        overflowY: 'scroll',
        overflowX: 'hidden'
    },
    enviar: {
        margin: theme.spacing.unit,
        width: 34,
        height: 12,
        fontFamily: 'Avenir',
        fontSize: 9,
        fontWeight: 900,
        fontStyle: 'normal',
        fontStretch: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        textAlign: 'center',
        color: '#8d9aa3',
        paddingLeft: 55

    },
    columns:{
        display: 'grid',
        'grid-template-columns': '3fr 1fr'
    }
>>>>>>> 0e9966cb6311990a0e2c29c21ca59c8aa3e279d1
});

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      message: '',
      messages: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeMessage = this.handleChangeMessage.bind(this)
  }
  componentDidMount() {
    firebase.database().ref(`rooms/${this.props.room}/messages/`).on('value', snapshoot => {
      const actMsj = snapshoot.val()
      if (actMsj !== null) {
        this.setState({
          messages: actMsj,
        })
      }
      var show = document.getElementById('style-1').lastChild
      show.scrollIntoView(false)
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    const newMessage = {
      id: this.state.messages.length,
      username: this.props.userName,
      textMessage: this.state.message,
      time: moment().format('LT')
    }
    firebase.database().ref(`rooms/${this.props.room}/messages/${newMessage.id}`)
      .set(newMessage)
      .then(() => {
        this.setState({ message: '' })
        this.setState({ username: '' })
        var show = document.getElementById('style-1').lastChild
        show.scrollIntoView(false)
      })
  }
    handleChangeMessage(event) {
        const value = event.target.value;
        this.setState({ message: value })

    }
   
    render() {
        let time = 0

        time = moment().format('LT')

        const { classes } = this.props;
        return (
            <div>
                <div>
                    <div id="style-1" >
                        {this.state.messages.map(txt => {
                            return <div className={classes.Field} key={txt.id}>
                             <div className = {classes.columns}>
                                    <div className={classes.name} >{txt.username.toUpperCase()}</div>
                                    <div className={classes.hora}>{txt.time}</div>
                                </div>
                                <div className={classes.text}>{txt.textMessage}</div>
                            </div>
                        })}
                    </div>
                </div>
                <form onSubmit={this.handleSubmit} >
                    <div className={classes.inputField}>
                        <Grid container>
                            <Grid item sm>
                                <Input
                                    placeholder="Escribe algo"
                                    onChange={this.handleChangeMessage}
                                    value={this.state.message}
                                    className={classes.input}
                                    inputProps={{
                                        'aria-label': 'Description',
                                    }}
                                />
                            </Grid>
                            <Grid item sm>
                                <Button type='submit' className={classes.enviar}>ENVIAR</Button>
                            </Grid>
                        </Grid>
                    </div>

                </form>
            </div>
        )
    }
}

Chat.propTypes = {
  classes: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  userName: state.users.userName,
});
const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Chat));





