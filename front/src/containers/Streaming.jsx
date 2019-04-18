import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import { Route } from 'react-router-dom';
import UploadFiles from "./UploadFiles";
import Dialog from "@material-ui/core/Dialog";
import AddParticipant from "./AddParticipant";
import firebase from "../firebase";
import ButtonBar from "./ButtonBar";
import Chat from "../components/Chat";
import Button from "@material-ui/core/Button";
import { Icon } from "@material-ui/core";

export default class VideoComponent extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false

    this.state = {
      identity: null,
      roomName: this.props.match.params.code,
      roomNameErr: false,
      previewTracks: null,
      hasJoinedRoom: false,
      activeRoom: null,
      participants: [],
      localId: "",
      sendFileOpen: false,
      Video: true,
      audio: true,
      main: 0,
      container: "",
    };

    this.disconnected2 = this.disconnected2.bind(this);
    this.detachattachLocalParticipantTracks = this.detachattachLocalParticipantTracks.bind(
      this
    );
    this.videoDisable = this.videoDisable.bind(this);
    this.handleOpenSendFile = this.handleOpenSendFile.bind(this);
    this.handleCloseSendFile = this.handleCloseSendFile.bind(this);
    this.audioDisable = this.audioDisable.bind(this);
    this.participantConnected = this.participantConnected.bind(this);
    this.participantDisconnected = this.participantDisconnected.bind(this);
    this.trackSubscribed = this.trackSubscribed.bind(this);
    this.trackUnsubscribed = this.trackUnsubscribed.bind(this);
    this.hardcodeo = this.hardcodeo.bind(this);
  }

  componentDidMount() {
    console.log('object', this.props)
    this._isMounted = true;

    firebase
      .database()
      .ref(`rooms/${this.props.match.params.code}`)
      .on("value", snapshoot => {
        if (!snapshoot.val()) {
          this.props.history.push("/");
        }
      });
    axios.post("/token", { name: this.props.userName }).then(results => {
      const { identity, token } = results.data;
      console.log('RESULT', results)
      if (this._isMounted) this.setState({ identity, token }, () => this.joinRoom());
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
      room.participants.forEach(this.hardcodeo);

      this.setState({
        localId: room.localParticipant,
        activeRoom: room,
        container: previewContainer
      });
      room.on("participantDisconnected", this.participantDisconnected);

      room.once("disconnected", error =>
        room.participants.forEach(this.participantDisconnected)
      );
      const newParti = this.state.participants.length
        ? this.state.participants.map(participant => {
          const entries = participant.tracks.entries();
          const status = { name: participant.sid };
          for (const [k, v] of entries) {
            status[k] = v.isTrackEnabled;
          }
          return status;
        })
        : [];
      this.setState({ statusParticipants: newParti });
    });
  }

  hardcodeo(participant) {
    this.state.participants.push(participant);
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

  videoDisable(e) {
    let img = new Image();
    img.src = "/utils/images/video.svg";
    img.style.position = "relative";
    img.id = "local-icon";
    this.state.Video == true
      ? this.state.localId.videoTracks.forEach(videoTracks => {
        videoTracks.track.disable();
        this.trackUnsubscribed(videoTracks.track)
        console.log(this.state.container)
        this.state.container.appendChild(videoTracks.track.attach(img));
        this.setState({ Video: false });
      })
      : this.state.localId.videoTracks.forEach(videoTracks => {
          document.getElementById(img.id).remove();
          this.state.container.appendChild(videoTracks.track.attach());
          videoTracks.track.enable();
          this.setState({ Video: true });
        });
        document.getElementById('videocam').classList.toggle('show')
  }
  audioDisable() {
    let micro = new Image()
    micro.src = "/utils/images/mute.svg"
    micro.id = "micro"
    this.state.audio == true
      ? this.state.localId.audioTracks.forEach(audioTracks => {

        audioTracks.track.disable();
        this.state.container.appendChild(micro)
        this.setState({ audio: false });
      })
      : this.state.localId.audioTracks.forEach(audioTracks => {
        audioTracks.track.enable();
        document.getElementById('micro').remove()
        this.setState({ audio: true });
      });
      document.getElementById('mic').classList.toggle('show')
  }

  disconnected2() {
    this.detachattachLocalParticipantTracks()
    document.getElementById("local-media").remove()
    this.state.activeRoom.disconnect()
    this.setState({ activeRoom: false })
  }
  participantConnected(participant) {
    const div = document.createElement("div");
    const div2 = document.createElement("h6");
    div.id = participant.sid;
    div2.innerText = participant.identity
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

    div.appendChild(div2)

  }
  participantDisconnected(participant) {
    document.getElementById(participant.sid).remove();
  }

  trackSubscribed(div, track) {
    let img = new Image();
    img.src = "/utils/images/video.svg";
    img.style.position = "absolute";
    img.id = "remote-icon";
    let micro = new Image();
    micro.src = "/utils/images/mute.svg";
    micro.id = "micro";
    micro.style.zIndex = "initial"
    div.style.position = "relative";
    if (track.kind == "audio") {
      (track.isEnabled) ? div.appendChild(track.attach()) : div.appendChild(track.attach(micro))
    }
    if (track.kind == "video") {
      (track.isEnabled) ? div.appendChild(track.attach()) : div.appendChild(track.attach(img))


    }
    track.on("disabled", () => {
      if (track.kind == "video") {
        if (!track.isEnabled) {
          this.trackUnsubscribed(track);
          div.appendChild(track.attach(img));
        }
      } else {
        if (!track.isEnabled) {
          div.appendChild(track.attach(micro));
        }
      }
    });
    track.on("enabled", () => {
      if (track.kind == "video") {
        if (track.isEnabled) {
          track.detach(img).remove();
          div.appendChild(track.attach());
        }
      } else {
        if (track.isEnabled) {
          track.detach(micro).remove();
        }
      }
    });
  }

  trackUnsubscribed(track) {
    track.detach().forEach(element => element.remove());
  }
  handleOpenSendFile() {
    this.setState({ sendFileOpen: true });
  }
  handleCloseSendFile() {
    this.setState({ sendFileOpen: false });
  }

  render() {
    console.log(this.props)
    return (
      <div className="Views">
        <div className="logoVideoConferencia">
          <div className="logoConferencia">
            <img className="logoConferencia" src="/utils/images/logor.png" />
          </div>
        </div>

        <div className="divDelMedio">
          {/* EN ESTE DIV SE VA A MOSTRAR LAS OPCIONES DE VISTA DE LA VIDEOCONFERENCIA Y LA LISTA DE PARTICIPANTES */}
          <div className="opcionesVista">
            <Button
              onClick={this.handleClickOpen}
              style={{ float: "right", marginTop: "12px" }}
            >
              <img className="add-participant" src="/utils/images/layout.svg" />
            </Button>
            <Button
              onClick={this.handleClickOpen}
              style={{ float: "right", marginTop: "12px" }}
            >
              <img
                className="add-participant"
                src="/utils/images/layout-full.svg"
              />
            </Button>
          </div>

          <div className="participantes">
            <AddParticipant dataSala={this.props.match.params.code} />
            <div id="totalRemote">
              <div
                onClick={(e) => {
                  console.log("holaaa", e.target)
                  const pantachota = e.target
                }}
                ref="remotmemedia"
                id="remote-media"
              />
            </div>
            <div ref="mainmedia" id="main-media" />
          </div>
        </div>

        <div className="divDeAbajo">
          {/* AQUI SE MUESTRA EL CHAT */}
          <div className="chat">
            <Route path={`/room/${this.props.match.params.code}`} render={() => <Chat room={this.props.match.params.code} />} />
          </div>

          {/* AQUI SE MUESTRA LA BARRA DE OPCIONES */}
          <div className="barraOpciones">
            <ButtonBar
              history={this.props.history}
              disconnect={this.disconnected2}
              videoDisable={this.videoDisable}
              audioDisable={this.audioDisable}
              handleOpenSendFile={this.handleOpenSendFile}
            />
          </div>

          <div className="camaraLocal">
            <Dialog
              open={this.state.sendFileOpen}
              onClose={this.handleCloseSendFile}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <UploadFiles
                handleCloseSendFile={this.handleCloseSendFile}
                roomCode={this.props.match.params.code}
              />
            </Dialog>
            {/* EN ESTE DIV SE VA A MOSTRAR LA CAMARA DEL USUARIO QUE INGRESA A LA VIDEOCONFERENCIA */}
            <div id='ellocal'>{this.props.userName} </div>
            <div ref="localMedia" id="local-media" />
          </div>
        </div>
      </div>
    );
  }
}

