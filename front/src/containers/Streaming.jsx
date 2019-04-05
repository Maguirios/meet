import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { Card, CardHeader, CardText } from "material-ui/Card";
import firebase from "../firebase";

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
      localId: ''
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.disconnected2 = this.disconnected2.bind(this)
    this.detachattachLocalParticipantTracks = this.detachattachLocalParticipantTracks.bind(this)
    // this.handleRoomNameChange = this.handleRoomNameChange.bind(this);


  }

  componentDidMount() {
    firebase
      .database()
      .ref(`rooms/${this.props.match.params.code}`)
      .on("value", snapshoot => {
        console.log(snapshoot.val());
        if (!snapshoot.val()) {
          this.props.history.push("/");
        }
        this.setState({ roomName: snapshoot.val().code });

        this.joinRoom();
      });
    axios.get("/token").then(results => {
      const { identity, token } = results.data;
      this.setState({ identity, token });
    });
  }

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
          console.log('Local')
          this.attachLocalParticipantTracks(room.localParticipant, previewContainer);
        }
      this.setState({
        localId: room.localParticipant,
        activeRoom: room,
        participant: room.participants
      });
      room.participants.forEach(participantConnected);
      room.on("participantConnected", participantConnected);

      room.on("participantDisconnected", participantDisconnected);
      room.once("disconnected", error =>
        room.participants.forEach(participantDisconnected)
      );
    });
  }

  attachLocalParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values());
    tracks.forEach(track => {
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
    this.state.activeRoom.disconnect();
    document.getElementById("local-media").remove();
    this.setState({ activeRoom: false, localMediaAvailable: false });
    this.detachattachLocalParticipantTracks();
  }
  render() {
    console.log(this.state.participant);
    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="flex-item">
        <div ref="localMedia" />
      </div>
    ) : (
      ""
    );

    return (
      <div className="Views">
        {showLocalTrack}
        <div className="flex-item">
          <div ref="localMedia" id="local-media">
            <RaisedButton
              label="Leave Room"
              secondary={true}
              onClick={() => this.disconnected2()}
            />
          </div>
          <div id="totalRemote">
            <div ref="remoteMedia" id="remote-media" />
          </div>
        </div>
        <br />
      </div>
    );
  }
}

function participantConnected(participant) {
  const div = document.createElement("div");
  div.id = participant.sid;
  // div.innerText = participant.identity;

  participant.on("trackSubscribed", track => trackSubscribed(div, track));
  participant.on("trackUnsubscribed", trackUnsubscribed);

  participant.tracks.forEach(publication => {
    if (publication.isSubscribed) {
      trackSubscribed(div, publication.track);
    }
  });
  let remoteMedias = document.getElementById("remote-media");
  remoteMedias.style.height = "150px";
  remoteMedias.appendChild(div);
}

function participantDisconnected(participant) {
  document.getElementById(participant.sid).remove();
}

function trackSubscribed(div, track) {
  div.appendChild(track.attach());
}

function trackUnsubscribed(track) {
  track.detach().forEach(element => element.remove());
}
