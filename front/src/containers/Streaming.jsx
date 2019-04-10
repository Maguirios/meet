import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import RaisedButton from "material-ui/RaisedButton";
import firebase from "../firebase";
import ButtonBar from "./ButtonBar";
import Chat from "../components/Chat";
import SalaEspera from "./SalaEspera";

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
      participant: [],
      localId: "",
      Video: true,
      audio: true,
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

    Video.connect(this.state.token, connectOptions).then(room => {
      var previewContainer = this.refs.localMedia;
      if (!previewContainer.querySelector("video")) {
        this.attachLocalParticipantTracks(
          room.localParticipant,
          previewContainer
        );
      }

      room.participants.forEach(this.participantConnected);
      room.on("participantConnected", this.participantConnected);
      this.setState({
        localId: room.localParticipant,
        activeRoom: room
      });

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

  disconnected2() {
    this.state.activeRoom.disconnect();
    document.getElementById("local-media").remove();
    this.setState({ activeRoom: false, localMediaAvailable: false });
    this.detachattachLocalParticipantTracks();
  }
  participantConnected(participant) {
    const div = document.createElement("div");
    div.id = participant.sid;
    div.innerText = participant.identity;

    participant.on("trackSubscribed", track =>
      this.trackSubscribed(div, track)
    );
    participant.on("trackUnsubscribed", this.trackUnsubscribed);

    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        trackSubscribed(div, publication.track);
      }
    });

    this.state.participant.push(participant);

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
    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="flex-item">
        <div ref="localMedia" />
      </div>
    ) : (
      ""
    );
    this.state.participant[0]
      ? console.log("aqui los tengo", this.state.participant)
      : null;
      
    this.state.participant.map(participants=>(
      console.log("holaaa",participants)
      ))
      return (
      <div className="Views">
        {showLocalTrack}
        <div className="flex-item">
          <div>
            <div ref="localMedia" id="local-media">
              <ButtonBar
                disconnect={this.disconnected2}
                videoDisable={this.videoDisable}
                audioDisable={this.audioDisable}
              />
            </div>
            {this.state.participant ? (
              <div id="totalRemote">
                {this.state.participant.map(participants => {
                  console.log("PAAARTICIPANT", (participants.tracks.values().next().value));
                    <div key={participants.sid}>
                      <div ref="remoteMedia" id="remote-media" />
                    </div>
                 
                })}
              </div>
            ) : null}
            <div id="totalRemote">
            <div ref={this.state.participant.sid} id="remote-media" />
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
