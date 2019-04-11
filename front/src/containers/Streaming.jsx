import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import RaisedButton from "material-ui/RaisedButton";
import TextField from "material-ui/TextField";
import UploadFiles from "./UploadFiles";
import Dialog from "@material-ui/core/Dialog";
import AddParticipant from "./AddParticipant";
import firebase from "../firebase";
import { Card, CardHeader, CardText } from "material-ui/Card";
import ButtonBar from "./ButtonBar";
import Chat from "../components/Chat";
import SalaEspera from "./SalaEspera";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";

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
      participants: [],
      localId: "",
      sendFileOpen: false,
      Video: true,
      audio: true,
      main: 0,
      container: "",
      statusParticipants: []
    };

    // this.joinRoom = this.joinRoom.bind(this);
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
    // this.mainScreen = this.mainScreen.bind(this);
    this.hardcodeo = this.hardcodeo.bind(this);

    // this.trash=this.trash.bind(this)
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
    axios.get("/participants").then(results => {
      console.log(results);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    prevState.statusParticipants.forEach(participant => {
      this.state.statusParticipants.forEach(tracks => {
        console.log(participant, tracks);
      });
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

  videoDisable() {
    let img = new Image();
    img.src = "/utils/images/video.svg";
    img.style.position = "absolute";
    img.id = "local-icon";
    this.state.Video == true
      ? this.state.localId.videoTracks.forEach(videoTracks => {
          videoTracks.track.detach();
          videoTracks.track.disable();
          this.state.container.appendChild(videoTracks.track.attach(img));
          this.setState({ Video: false });
        })
      : this.state.localId.videoTracks.forEach(videoTracks => {
          document.getElementById(img.id).remove();
          this.state.container.appendChild(videoTracks.track.attach());
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

    participant.on("trackSubscribed", track => {
      console.log("trackchange", track);
      this.trackSubscribed(div, track);
    });
    participant.on("trackUnsubscribed", this.trackUnsubscribed);
    participant.tracks.forEach(publication => {
      console.log("publication", publication);

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
    let img = new Image();
    img.src = "/utils/images/video.svg";
    img.style.position = "absolute";
    img.id = "local-icon";
    div.appendChild(track.attach());
    track.on("disabled", () => {
      if (track.kind == "video") {
        if (!track.isEnabled) {
          this.trackUnsubscribed(track)
          div.appendChild(track.attach(img));
        }
      }
    });
    track.on("enabled", () => {
      
      if (track.kind == "video") {
        if (track.isEnabled) {
          track.detach(img).remove()
          div.appendChild(track.attach());
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
            <AddParticipant dataSala={this.state} />
            <div id="totalRemote">
              <div
                onClick={() => console.log("holaaa")}
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
            <Chat room={this.props.match.params.code} />
          </div>

          {/* AQUI SE MUESTRA LA BARRA DE OPCIONES */}
          <div className="barraOpciones">
            <ButtonBar
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
            <div ref="localMedia" id="local-media" />
          </div>
        </div>
      </div>
    );
  }
}
