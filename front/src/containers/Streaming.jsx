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
      activeRoom: null
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

    Video.connect(this.state.token, connectOptions).then(
      room=>{
        console.log(room)
        this.roomJoined(room)
      }
    ).catch(err=>{
      console.log(err)
    });
  }

  attachTracks(tracks, container) {
    tracks.forEach(track => {
      console.log("track invisible?", track);
      container.appendChild(track.track.attach());
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
      this.attachParticipantTracks(room.localParticipant, previewContainer);
    }

    room.participants.forEach(participant => {
      console.log("Already in Room: '" + participant.identity + "'");
      var previewContainer = this.refs.remoteMedia;
      this.attachParticipantTracks(participant, previewContainer);
    });

    room.on("participantConnected", participant => {
      console.log("Joining: '" + participant.identity + "'");

      participant.tracks.forEach(publication => {
        if (true) {
          const track = publication.track;
          document.getElementById("remote-media").appendChild(track.attach());
        }
      });
      participant.on("trackSubscribed", track => {
        document.getElementById("remote-media").appendChild(track.attach());
      });
    });
    room.on("trackAdded", (track, participant) => {

      console.log(participant.identity + " added track: " + track.kind);
      var previewContainer = document.getElementById("remote-media");
      this.attachTracks([track], previewContainer);
    });

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
      track.track.detach().forEach(detachedElement => {
        detachedElement.remove();
      });
    });
  }
  //{Participantes}
  detachParticipantTracks(participant) {
    var tracks = Array.from(participant.tracks.values());
    this.detachTracks(tracks);
  }
  //Setea el estado   a una Active Room

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
              <div className="Views" ref="remoteMedia" id="remote-media" />
            </div>
            <br />
            {joinOrLeaveRoomButton}
          </div>
        </CardText>
      </Card>
    );
  }
}
