import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { Card, CardHeader, CardText } from "material-ui/Card";
import firebase from '../firebase';
import ButtonBar from './ButtonBar';
import Chat from '../components/Chat';
import UploadFiles from './UploadFiles'
import Dialog from '@material-ui/core/Dialog';

export default class VideoComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      identity: null,
      roomName: "",
      roomNameErr: false,
      previewTracks: null,
      localMediaAvailable: false,
      hasJoinedRoom: false,
      activeRoom: null,
      participant: '',
      localId: '',
      sendFileOpen: false,
    };

    this.joinRoom = this.joinRoom.bind(this);
    this.disconnected2 = this.disconnected2.bind(this)
    this.detachattachLocalParticipantTracks = this.detachattachLocalParticipantTracks.bind(this)
    // this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.handleOpenSendFile = this.handleOpenSendFile.bind(this)
    this.handleCloseSendFile = this.handleCloseSendFile.bind(this)
  }

  // Busca el token  creado en el back
  componentDidMount() {
    firebase.database().ref(`rooms/${this.props.match.params.code}`).on('value', snapshoot => {
      if (!snapshoot.val()) {
        this.props.history.push('/')
      }
      this.setState({ roomName: snapshoot.val().code })
      this.joinRoom();
    })
    axios.get("/token").then(results => {
      const { identity, token } = results.data;
      this.setState({ identity, token });
    });
  }

  componentDidUpdate(prevProps, prevState){
    prevState.identity
  }

  // Se una a la sala
  joinRoom() {

    let connectOptions = {
      name: this.state.roomName
    };

    if (this.state.previewTracks) {
      connectOptions.tracks = this.state.previewTracks;
    }

    Video.connect(this.state.token, connectOptions)
      .then(room => {
        // this.roomJoined(room);
        var previewContainer = this.refs.localMedia;
        if (!previewContainer.querySelector("video")) {
          this.attachLocalParticipantTracks(room.localParticipant, previewContainer);
        }
        this.setState({ activeRoom: room })
        this.setState({ localId: room.localParticipant })
        room.participants.forEach(participantConnected);
        room.on('participantConnected', participantConnected);

        room.on('participantDisconnected', participantDisconnected);
        room.once('disconnected', error => room.participants.forEach(participantDisconnected));
      })
      .catch(err => {
        console.log(err);
      });
  }

  attachLocalParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values());
    tracks.forEach((track) => {
      container.appendChild(track.track.attach());
    });
  }
  detachattachLocalParticipantTracks() {
    var tracks = Array.from(this.state.localId.tracks.values());
    tracks.forEach(track => {
      const attachedElements = track.track.detach();
      attachedElements.forEach(element => element.remove());
      this.props.history.push("/");
    });
  }
  disconnected2() {
    this.state.activeRoom.disconnect()
    document.getElementById("local-media").remove();
    this.setState({ activeRoom: false, localMediaAvailable: false });
    this.detachattachLocalParticipantTracks();
  }

  handleOpenSendFile() {
    this.setState({ sendFileOpen: true })
  }
  handleCloseSendFile() {
    this.setState({ sendFileOpen: false });
  };
  render() {
    //TERNARIOOOO
    let showLocalTrack = this.state.localMediaAvailable ?
      (
        <div className="flex-item">
          {" "}
          <div ref="localMedia" />{" "}
        </div>
      )
      :
      (
        ""
      );
    console.log('Estado del componente', this.state)
    return (

      <div className="Views">
        {showLocalTrack}
        <div className="flex-item">
          <div className="logoVideoConferencia">
            {/* EN ESTE DIV TIENE QUE IR EL LOGO QUE SE MUESTRA EN LA VIDEOCONFERENCIA ARRIBA DE TODO */}

            
          </div>

          <div className="divDelMedio">
            {/* EN ESTE DIV SE VA A MOSTRAR LAS OPCIONES DE VISTA DE LA VIDEOCONFERENCIA Y LA LISTA DE PARTICIPANTES */}

            
          </div>

          <div className="divDeAbajo">
            {/* EN ESTE DIV SE VA A MOSTRAR EL CHAT, LA BARRA DE OPCIONES DE LA VIDEOCONFERENCIA Y LA CAMARA LOCAL */}



          </div>
          {/* <TextField
                hintText="Room Name"
                onChange={this.handleRoomNameChange}
                errorText={
                  this.state.roomNameErr ? "Room Name is required" : undefined
                }
              /> */}
          <div>
            {
              // this.props.participants.map((participant) => <div id={} ref="" />)
              // Otro metodo para rederear el video de los participantes
            }
          </div>
          <div>
            <div ref="localMedia" id="local-media">
              {/* <RaisedButton
                label="Leave Room"
                secondary={true}
                onClick={() => this.disconnected2()}
              /> */}
              <ButtonBar disconnect={this.disconnected2} handleOpenSendFile={this.handleOpenSendFile} />
            </div>
            <div id='totalRemote'>
              <div ref="remoteMedia" id='remote-media' />
            </div>
            <div>
              <Chat room={this.props.match.params.code} />
            </div>

            <Dialog
              open={this.state.sendFileOpen}
              onClose={this.handleCloseSendFile}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <UploadFiles handleCloseSendFile={this.handleCloseSendFile} roomCode={this.props.match.params.code}/>
            </Dialog>

          </div>
        </div>
        <br />
      </div>
    );
  }
}


function participantConnected(participant) {

  const div = document.createElement('div');
  div.id = participant.sid;
  // div.innerText = participant.identity;

  participant.on('trackSubscribed', track => trackSubscribed(div, track));
  participant.on('trackUnsubscribed', trackUnsubscribed);

  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) {
      trackSubscribed(div, publication.track);
    }
  });

  let remoteMedias = document.getElementById('remote-media');
  remoteMedias.style.height = '150px'
  remoteMedias.appendChild(div);
}

function participantDisconnected() {
  // document.getElementById(participant.sid).remove();
}

function trackSubscribed(div, track) {
  div.appendChild(track.attach());
}

function trackUnsubscribed(track) {
  track.detach().forEach(element => element.remove());
}