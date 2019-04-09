import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import { Card, CardHeader, CardText } from "material-ui/Card";
import firebase from '../firebase';
import ButtonBar from './ButtonBar';
import Chat from '../components/Chat';


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
      participants: '',
      localId: ''
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.disconnected2 = this.disconnected2.bind(this)
    this.detachattachLocalParticipantTracks = this.detachattachLocalParticipantTracks.bind(this)
    this.participantConnected = this.participantConnected.bind(this)
    this.participantDisconnected = this.participantDisconnected.bind(this)
    this.trackSubscribed = this.trackSubscribed.bind(this)
    this.trackUnsubscribed = this.trackUnsubscribed.bind(this)
    }

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


  joinRoom() {
    let connectOptions = {
      name: this.state.roomName
    };

    if (this.state.previewTracks) {
      connectOptions.tracks = this.state.previewTracks;
    }

    Video.connect(this.state.token, connectOptions)
      .then(room => {
        var previewContainer = this.refs.localMedia;
        if (!previewContainer.querySelector("video")) {
          this.attachLocalParticipantTracks(room.localParticipant, previewContainer);
        }
        this.setState({ activeRoom: room })
        this.setState({ localId: room.localParticipant })
        this.setState({ participants : room.participants})
        room.participants.forEach(this.participantConnected);
        room.on('participantConnected', this.participantConnected);
        room.on('participantDisconnected', this.participantDisconnected);
        room.once('disconnected', error => room.participants.forEach(this.participantDisconnected));
      })
      .catch(err => {
        console.log(err);
      });
  }

  participantConnected(participant) {

    const div = document.createElement('div');
    div.id = participant.sid;
  
    participant.on('trackSubscribed', track => this.trackSubscribed(div, track));
    participant.on('trackUnsubscribed', this.trackUnsubscribed);
  
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        this.trackSubscribed(div, publication.track);
      }
    });

    let remoteMedias = document.getElementById('remote-media');
    remoteMedias.style.height = '150px'
    remoteMedias.appendChild(div);
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


  participantDisconnected() {
  }
  
  trackSubscribed(div, track) {
    div.appendChild(track.attach());
  }
  
  trackUnsubscribed(track) {
    track.detach().forEach(element => element.remove());
  }

  disconnected2() {
    this.state.activeRoom.disconnect()
    document.getElementById("local-media").remove();
    this.setState({ activeRoom: false, localMediaAvailable: false });
    this.detachattachLocalParticipantTracks();
  }

  render() {
    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="flex-item">
        {" "}
        <div ref="localMedia" />{" "}
      </div>
    ) : (
      ""
      );
      var map;
    return (

      <div className="Views">
        {showLocalTrack}
        <div className="flex-item">
          {/* <TextField
                hintText="Room Name"
                onChange={this.handleRoomNameChange}
                errorText={
                  this.state.roomNameErr ? "Room Name is required" : undefined
                }
              /> */
              
              this.state.participants ? map = this.state.participants.entries() : null
              }
          <div>
            <div ref="localMedia" id="local-media">
              {/* <RaisedButton
                label="Leave Room"
                secondary={true}
                onClick={() => this.disconnected2()}
              /> */}
              <ButtonBar disconnect={this.disconnected2} />
            </div>
            <div id='totalRemote'>
              <div ref="remoteMedia" id='remote-media' />
            </div>
            <div>
              <Chat room={this.props.match.params.code} />
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  }
}




