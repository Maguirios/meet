import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import firebase from "../firebase";
import ButtonBar from "./ButtonBar";
import Chat from "../components/Chat";

export default class VideoComponent extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false

    this.state = {
      identity: null,
      roomName: "",
      roomNameErr: false,
      previewTracks: null,
      localMediaAvailable: false,
      hasJoinedRoom: false,
      activeRoom: null,
      participants: [],
      localId: "",
      Video: true,
      audio: true,
      main: 0,
      tracks: ''
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.disconnected2 = this.disconnected2.bind(this);
    this.detachattachLocalParticipantTracks = this.detachattachLocalParticipantTracks.bind(
      this
    );
    this.videoDisable = this.videoDisable.bind(this);
    this.audioDisable = this.audioDisable.bind(this);
    this.participantConnected = this.participantConnected.bind(this);
    this.participantDisconnected = this.participantDisconnected.bind(this);
    this.trackSubscribed = this.trackSubscribed.bind(this);
    this.trackUnsubscribed = this.trackUnsubscribed.bind(this);
    this.mainScreen = this.mainScreen.bind(this);
    this.avChange = this.avChange.bind(this);
  }

  componentDidMount() {
    firebase
      .database()
      .ref(`rooms/${this.props.match.params.code}`)
      .on("value", snapshoot => {
        if (!snapshoot.val()) {
          this.props.history.push("/");
        }
        this.setState({ roomName: snapshoot.val().code });

        this.joinRoom();
      });
    axios.post("/token").then(results => {
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

    Video.connect(this.state.token, connectOptions).then(room => {
      var previewContainer = this.refs.localMedia;
      if (!previewContainer.querySelector("video")) {
        this.attachLocalParticipantTracks(
          room.localParticipant,
          previewContainer
        );
      }

      room.on("participantConnected", this.participantConnected);
      room.participants.forEach(this.participantConnected);
      this.setState({
        localId: room.localParticipant,
        activeRoom: room
      });
      console.log(this.state.activeRoom.sid)
      const check = { sid : this.state.activeRoom.sid}
      axios.post('/participants', check)
      .then(participants => console.log(participants))
      room.on('audioDisable', this.audioDisable)
      room.on('audioVideo', this.videoDisable)
      room.participants.forEach(this.avChange);
      room.on("participantDisconnected", this.participantDisconnected);
      room.once("disconnected", error =>
        room.participants.forEach(this.participantDisconnected)
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
  videoDisable() {
    this.state.Video == true
      ? this.state.localId.videoTracks.forEach(videoTracks => {
        videoTracks.track.disable();
        this.setState({ Video: false });
      })
      : this.state.localId.videoTracks.forEach(videoTracks => {
        videoTracks.track.enable();
        this.setState({ Video: true });
      });
  }
  audioDisable() {
    this.state.audio == true
      ? this.state.localId.audioTracks.forEach(audioTracks => {
        audioTracks.track.disable();
        this.setState({ audio: false });
      })
      : this.state.localId.audioTracks.forEach(audioTracks => {
        audioTracks.track.enable();
        this.setState({ audio: true });
      });
  }


  mainScreen(participant) {
    if (this.state.main == 0) {
      const div = document.createElement("div");
      div.id = participant.sid;
      div.innerText = participant.identity;

      participant.on("trackSubscribed", track => {
        this.trackSubscribed(div, track);
      });
      participant.on("trackUnsubscribed", this.trackUnsubscribed);

      participant.tracks.forEach(publication => {
        if (publication.isSubscribed) {
          trackSubscribed(div, publication.track);
        }
      });

      let remoteMedias = document.getElementById("main-media");
      remoteMedias.appendChild(div);
      this.state.main = 1;
    }
  }

  avChange() {
    console.log(this.state.participants)
    this.state.participants.forEach((track) => {
      console.log(track.tracks, '-CHECK')
    })
  }



  disconnected2() {
    this.state.activeRoom.disconnect();
    document.getElementById("local-media").remove();
    this.setState({ activeRoom: false, localMediaAvailable: false });
    this.detachattachLocalParticipantTracks();
  }
  participantConnected(participant) {
    // participant.on('audioDisable', () => { })
    // var check = Array.from(participant.tracks.values())
    // console.log(check)
    // var button = document.createElement('button');
    // button.onclick = function (e) {
    // console.log(e)
    // };
    const div = document.createElement("div");
    div.id = participant.sid;
    div.innerText = participant.identity;
    // div.appendChild(button)


    this.state.participants.push(participant);

    participant.on("trackSubscribed", track => {
      this.trackSubscribed(div, track);
    });
    participant.on("trackUnsubscribed", this.trackUnsubscribed);

    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        trackSubscribed(div, publication.track);
      }
    });

    let remoteMedias = document.getElementById("remote-media");
    remoteMedias.appendChild(div);
  }

  participantDisconnected(participant) {
    document.getElementById(participant.sid).remove();
  }

  trackSubscribed(div, track) {
    div.appendChild(track.attach());
  }

  trackUnsubscribed(track) {
    track.detach().forEach(element => element.remove());
  }
  render() {
    // if(this.state.participants.length>0)this.mainScreen(this.state.participants[0])
    return (
      <div>
        {/* {this.state.participants[0] && console.log(this.state.participants[0].tracks.entries().next().value[1])} */}
        <div ref="localMedia" id="local-media" />
        <ButtonBar
          disconnect={this.disconnected2}
          videoDisable={this.videoDisable}
          audioDisable={this.audioDisable}
        />
        <div id="totalRemote">
          <div
            onClick={() => this.avChange}
            ref="remotemedia"
            id="remote-media"
          />
        </div>
        <div ref="mainmedia" id="main-media" />
        <div>
          <Chat room={this.props.match.params.code} />
        </div>
      </div>
    );
  }
}
