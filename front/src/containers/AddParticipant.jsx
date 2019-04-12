import React from 'react';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from '../firebase'
import axios from 'axios'


import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    icon: {
        height: 75,
        width: 75,
        objectFit: 'contain',
        roomCode: '', 
        roomTitle: '',
        date: '',
        time: ''
    },
    iconButton: {
        marginTop: 15,
        float: 'right'
    }
});

export class AddParticipant extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            roomCode: '',
            countEmails: []
        }
        this.handleClose = this.handleClose.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };
    
    componentDidMount(){
        firebase.database().ref(`/rooms/${this.props.dataSala}`).on("value", (snapshot) => {
            this.setState({ countEmails: snapshot.val().emails, roomTitle: snapshot.val().name, date: snapshot.val().date, roomCode: snapshot.val().code })
        })
        
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })
        
    }

    handleSubmit(e) {
        e.preventDefault();
        const addEmails = this.state.countEmails.concat(this.state.email.replace(/\s/g, "").split(','))
        firebase.database().ref(`rooms/${this.props.dataSala.roomName}/emails/`)
            .set(addEmails)
           
            this.setState({ open: false })

            var template_content = [
                { "name": "guestName",  "content": 'Hola' },
                { "name": "guestEmail", "content": 'plataforma@mail'  },
                { "name": "roomCode",   "content":  this.state.roomCode },
                { "name": "roomTitle",  "content": this.state.roomTitle },
                { "name": "roomDate",   "content":  this.state.date + ' ' + ' hs' },
                { "name": "ownerName",  "content": this.state.name },
                { "name": "ownerEmail", "content": 'owner@gmail.com' }
              ]
              
              var emails = this.state.email.replace(/\s/g, "").split(',')
              
              const params = {
              message : {
                  to: [],
                  from_email: 'no-reply@insideone.com.ar',
                  from_name: 'Meet',
                  subject : `Videollamada`,
                  "global_merge_vars": [
                      {
                          "name": "LINK",
                          "content": 'http://localhost:3000/'
                      },
                      {
                          "name": "participants",
                          "content": emails
                      },
                      {
                          "name": "hasParticipants",
                          "content": true
                      }
                  ]
      
              },
              template_name : 'meeting-invite',
              template_content
          }
      
              emails.map(userEmail => {
              params.message.to.push({email: userEmail})
              
            })
        
          axios.post('/api/sendEmail', params )
         .then(email => {
           console.log(email)    
         })
      }
            


    handleClickOpen() {
        this.setState({ open: true });
    };

    handleClose() {
        this.setState({ open: false });
    };


    render() {
        const { dataSala, classes } = this.props
        return (
            <div>

                <Button id='add-participant' onClick={this.handleClickOpen}>
                    <img src="/utils/images/add-participant.svg" />
                </Button>
                <form autoComplete="off" >
                    <Dialog
                        open={this.state.open}
                        onClose={this.handleClose}
                        aria-labelledby="form-dialog-title"
                    >
                        <DialogTitle id="form-dialog-title">ENVIAR INVITACIÓN</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Nombre"
                                name='name'
                                type="name"
                                fullWidth
                                onChange={this.handleChange}
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Email Address"
                                name='email'
                                type="email"
                                fullWidth
                                onChange={this.handleChange}
                            />
                        </DialogContent>
                        <DialogActions >
                            <Button onClick={this.handleClose} color="primary">CANCEL</Button>
                            <Button onClick={(e) => this.handleSubmit(e)} color="primary" >ENVIAR INVITACIÓN</Button>
                        </DialogActions>
                    </Dialog>
                </form>

            </div>
        );
  }
}
const mapStateToProps = (state) => ({
  userName: state.users.userName
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddParticipant));