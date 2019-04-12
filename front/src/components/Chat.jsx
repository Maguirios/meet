import React from 'react';
import firebase from '../firebase';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import Axios from 'axios';


const styles = theme => ({
  input: {
    color: 'white'
  },
  Field: {
    display: 'grid',
    'grid-auto-rows': 'minmax(30px, auto) ',
    width: 200,
    borderRadius: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    marginBottom: 5,
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
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 500,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#ffffff',
    'word-break': 'break-all',
    wordBreak: 'normal',
  },
  name: {
    fontFamily: 'Roboto',
    fontSize: 9,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#8d9aa3'
  },
  hora: {
    height: 16,
    fontFamily: 'Roboto',
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
    maxWidth: 500,
    overflowY: 'scroll',
    overflowX: 'hidden',
    '&::-webkit-scrollbar':{
        width: '1px'
    }
  },
  enviar: {
    margin: theme.spacing.unit,
    width: 34,
    height: 12,
    fontFamily: 'Roboto',
    fontSize: 9,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    textAlign: 'center',
    color: '#8d9aa3',
    paddingLeft: 55

  },
  columns: {
    display: 'grid',
    'grid-template-columns': '3fr 1fr'
  },
  archivo: {
    display: 'grid',
    width: 180,
    height: 44,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    padding: 5,
    paddingLeft: 10,
    alignItems: 'center',
    margin: '0 auto',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  fileSize: {
    fontSize: 12,
    fontWeight: 500,
    color: '#8d9aa3',
  },
  fileName: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 700,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#5c6f7b',
  },
  fileAction: {
    fontFamily: 'Roboto',
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#ffffff',
    marginBottom: 3
  }
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
      else {
        var show = document.getElementById('style-1').lastChild;
      }
      (show) ? show.scrollIntoView(false) : null
    })
  }

  handleDownload(fileName) {

    var storage = firebase.storage();

    // Create a storage reference from our storage service
    var storageRef = storage.ref();

    //var  pathReference= storage.refFromURL('my url obtained from file properties in firebase storage');
    var pathReference = storageRef.child(`meet/${fileName}`);

    // Get the download URL
    pathReference.getDownloadURL().then(function (url) {
      Axios({
        url: url,
        method: 'GET',
        responseType: 'blob',
      })
        .then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileName);
          document.body.appendChild(link);
          link.click();
        });
    }).catch(function (error) {
      switch (error.code) {
        case 'storage/object-not-found':
          alert(error.message);
          // File doesn't exist
          break;
        case 'storage/unauthorized':
          alert(error.message);
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          alert(error.message);
          // User canceled the upload
          break;
        case 'storage/unknown':
          alert(error.message);
          // Unknown error occurred, inspect the server response
          break;
      }
    });
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
        <div className = {classes.container}>
          <div id="style-1" >
            {this.state.messages.map(txt => {
              return (txt.document) ?
                <div className={classes.Field} key={txt.id}>
                  <div className={classes.columns}>
                    <div className={classes.name} >{txt.username.toUpperCase()}</div>
                    <div className={classes.hora}>{txt.time}</div>
                    <div className={classes.fileAction} >Ha subido un archivo</div>
                  </div>
                  <div className={classes.archivo} onClick={() => this.handleDownload(txt.fileName)}>
                    <div className={classes.fileName}>{txt.fileName}</div>
                    <div className={classes.fileSize}>{txt.fileSize}</div>
                  </div>
                </div>
                :
                <div className={classes.Field} key={txt.id}>
                  <div className={classes.columns}>
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
  userName: state.users.userName ? state.users.userName : state.firebase.auth.displayName,
});
const mapDispatchToProps = (dispatch) => ({

})

export default compose(firebaseConnect([
  'rooms']),
 connect(mapStateToProps, mapDispatchToProps))(withStyles(styles)(Chat))





