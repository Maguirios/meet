import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from '../firebase'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { createMuiTheme } from '@material-ui/core/styles';

const styles = theme => ({
    icon: {
        height: 75,
        width: 75,
        objectFit: 'contain',
    },
    headerUpload: {
        display: 'grid',
        'grid-template-columns': '2fr 1fr'
    },
    titleUpload: {
        marginLeft: 20,
        width: 150,
        height: 19,
        fontFamily: 'Roboto',
        fontSize: 14,
        fontStyle: 'normal',
        fontStretch: 'normal',
        lineHeight: 'normal',
        letterSpacing: 'normal',
        color: '#8d9aa3',
    },
    cancelContainer: {
        display: 'grid',
        justifyItems: 'end'
    },
    cancel: {
        fontFamily: 'Nunito',
        width: 15,
        height: 15,
        color: '#8d9aa3',
        margin: 10,
    },
    enviar: {
        display: 'grid',
        justifyItems: 'center'
    },
    button: {
        backgroundColor: '#4dc2f1',
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

    componentDidMount() {
        firebase.database().ref(`rooms/${this.props.room}/emails/`).on("value", (snapshot) => {
            console.log('El arreglo de emails', snapshot.val());
            this.setState({ countEmails: snapshot.val() })
        })

    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value })

    }

    handleSubmit(e) {
        e.preventDefault();
        const addEmails = this.state.countEmails.concat(this.state.email.replace(/\s/g, "").split(','))
        firebase.database().ref(`rooms/${this.props.room}/emails/`)
            .set(addEmails)

        this.setState({ open: false })
    }

    handleClickOpen() {
        this.setState({ open: true });
    };

    handleClose() {
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props
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
                        <div className={classes.headerUpload}>
                            <p className={classes.titleUpload}>ENVIAR INVITACIÓN</p>
                            <div className={classes.cancelContainer}>
                                <IconButton onClick={this.handleClose} aria-label="Close" className={classes.closeButton} >
                                    <CloseIcon />
                                </IconButton>
                            </div>
                        </div>
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
                        <div className={classes.enviar}>
                            <DialogActions >
                                <Button onClick={(e) => this.handleSubmit(e)} className={classes.button} variant="contained" color='primary' component="span" >ENVIAR INVITACIÓN</Button>
                            </DialogActions>
                        </div>
                    </Dialog>
                </form>

            </div>
        );
    }
}
AddParticipant.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AddParticipant));