import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { Card, CardHeader, CardText } from "material-ui/Card";
import firebase from '../firebase';


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
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    // this.handleRoomNameChange = this.handleRoomNameChange.bind(this);

  }

  // Busca el token  creado en el back
  componentDidMount() {
    firebase.database().ref(`rooms/${this.props.match.params.code}`).on('value', snapshoot => {
      console.log(snapshoot.val())
      if (!snapshoot.val()) {
        this.props.history.push('/')
      }
      this.setState({ roomName: snapshoot.val().code })

      this.joinRoom();
    })
    axios.get("/token").then(results => {
      const { identity, token } = results.data;
      this.setState({ identity, token });
      console.log(results);
    });
  }
  //Setea el nombred e la room
  // handleRoomNameChange(e) {
  //   let roomName = e.target.value;
  //   this.setState({ roomName });
  // }

  handleClick() {
    console.log(this.state)
  }
  // Se una a la sala
  joinRoom() {
    // if (!this.state.roomName.trim()) {
    //   this.setState({ roomNameErr: true });
    //   return;
    // }

    console.log("Joining room '" + this.state.roomName + "'...");
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
          console.log('Local')
          this.attachLocalParticipantTracks(room.localParticipant, previewContainer);
        }

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
    console.log(participant);
    var tracks = Array.from(participant.tracks.values());
    console.log(tracks);
    tracks.forEach((track) => {
      console.log("track invisible?", track);
      container.appendChild(track.track.attach());
      console.log("holaa", track);
    });
  }



  //Sales de la sala
  leaveRoom() {
    this.state.activeRoom.disconnect();
    this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
  }

  render() {
    //TERNARIOOOO
    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="flex-item">
        {" "}
        <div ref="localMedia" />{" "}
      </div>
    ) : (
        ""
      );

    let joinOrLeaveRoomButton = this.state.hasJoinedRoom ? (
      <RaisedButton
        label="Leave Room"
        secondary={true}
        onClick={this.leaveRoom}
      />
    ) : (
        <RaisedButton label="Join Room" primary={true} onClick={this.joinRoom} />
      );

    return (
      <Card>
        <CardText>
          <div className="Views">
            {showLocalTrack}
            <div className="flex-item">
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

                <div ref="localMedia" id='local-media' />
                <div id='totalRemote'>

                  <div ref="remoteMedia" id='remote-media' />

                </div>

              </div>
            </div>
            <br />
          </div>
        </CardText>
      </Card>
    );
  }
}


function participantConnected(participant) {

  const div = document.createElement('div');
  div.id = participant.sid;
  div.innerText = participant.identity;

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

function participantDisconnected(participant) {
  console.log('Participant "%s" disconnected', participant.identity);
  document.getElementById(participant.sid).remove();
}

function trackSubscribed(div, track) {
  div.appendChild(track.attach());
}

function trackUnsubscribed(track) {
  track.detach().forEach(element => element.remove());
}