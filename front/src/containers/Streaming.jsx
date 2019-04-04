import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { Card, CardHeader, CardText } from "material-ui/Card";

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
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this);
    this.roomJoined = this.roomJoined.bind(this);
    this.attachTracks = this.attachTracks.bind(this);
    this.attachParticipantTracks = this.attachParticipantTracks.bind(this);
    this.detachTracks = this.detachTracks.bind(this);
    this.detachParticipantTracks = this.detachParticipantTracks.bind(this);
  }

  // Busca el token  creado en el back
  componentDidMount() {
    axios.get("/token").then(results => {
      const { identity, token } = results.data;
      this.setState({ identity, token });
      console.log(results);
    });
  }
  //Setea el nombred e la room
  handleRoomNameChange(e) {
    let roomName = e.target.value;
    this.setState({ roomName });
  }
  // Se una a la sala
  joinRoom() {
    if (!this.state.roomName.trim()) {
      this.setState({ roomNameErr: true });
      return;
    }

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

  attachTracks(tracks, container) {
    tracks.forEach((track) => {
      console.log("track invisible?", track);
      container.appendChild(track.attach());
      console.log("holaa", track);
    });
  }
  
  //Lo mismo que lo de arriba
  attachParticipantTracks(participant, container) {
    console.log(participant);
    var tracks = Array.from(participant.tracks.values());
    console.log(tracks);
    this.attachTracks(tracks, container);
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

  //Sigue el curso de la camara
  roomJoined(room) {
    console.log("Joined as '" + this.state.identity + "'");
    this.setState({
      activeRoom: room,
      localMediaAvailable: true,
      hasJoinedRoom: true
    });

    var previewContainer = this.refs.localMedia;
    if (!previewContainer.querySelector("video")) {
      console.log('Local')
      this.attachLocalParticipantTracks(room.localParticipant, previewContainer);
    }

    room.participants.forEach(participant => {
      var previewContainer = this.refs.remoteMedia;
      this.attachParticipantTracks(participant, previewContainer);
    });

    room.on('participantConnected', participant => {
      console.log("Joining: '" + participant.identity + "'");
    });

    room.on('trackAdded', (track, participant) => this.attachTracks([track], this.refs.remoteMedia));


    room.on("trackRemoved", (track, participant) => {
      this.log(participant.identity + " removed track: " + track.kind);
      this.detachTracks([track]);
    });

    room.on("participantDisconnected", participant => {
      console.log("Participant '" + participant.identity + "' left the room");
      this.detachParticipantTracks(participant);
    });
    room.on("disconnected", () => {
      if (this.state.previewTracks) {
        this.state.previewTracks.forEach(track => {
          track.stop();
        });
      }
      this.detachParticipantTracks(room.localParticipant);
      room.participants.forEach(this.detachParticipantTracks);
      this.state.activeRoom = null;
      this.setState({ hasJoinedRoom: false, localMediaAvailable: false });
    });
  }
  //{Participantes}
  detachTracks(tracks) {
    tracks.forEach(track => {
      console.log("holaaaaaquivaa");
      track.track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
    });
  }
  //{Participantes}
  detachParticipantTracks(participant) {
    console.log("holaa aqui fuee");
    var tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
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
              <TextField
                hintText="Room Name"
                onChange={this.handleRoomNameChange}
                errorText={
                  this.state.roomNameErr ? "Room Name is required" : undefined
                }
              />
                                                                                                                                                  
              <div>
                {
                  // this.props.participants.map((participant) => <div id={} ref="" />)
                  // Otro metodo para rederear el video de los participantes
                }
              </div>


              <div ref="localMedia" />
           |
            </div>
            <br />
            {joinOrLeaveRoomButton}
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