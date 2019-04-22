import React, { Component } from "react";
import Video from "twilio-video";
import axios from "axios";
import { Route } from "react-router-dom";
import UploadFiles from "./UploadFiles";
import Dialog from "@material-ui/core/Dialog";
import AddParticipant from "./AddParticipant";
import firebase from "../firebase";
import ButtonBar from "./ButtonBar";
import Chat from "../components/Chat";
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'
import { connect } from 'react-redux';
import Permisos from './Permisos';
import SalaEspera from './SalaEspera';
import Button from "@material-ui/core/Button";
import moment from 'moment';
import { Icon } from "@material-ui/core";

class VideoComponent extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      Video: true,
      audio: true,
      main: false,
      localId: "",
      container: "",
      statusParticipants: [],
      viewsAll: false,
      identity: null,
      activeRoom: null,
      sendFileOpen: false,
      roomName: this.props.match.params.code,
      permisos: false,
      participants: false,
    };

    this.onClick = this.onClick.bind(this);
    this.mainScreen = this.mainScreen.bind(this);
    this.videoDisable = this.videoDisable.bind(this);
    this.audioDisable = this.audioDisable.bind(this);
    this.trackSubscribed = this.trackSubscribed.bind(this);
    this.trackUnsubscribed = this.trackUnsubscribed.bind(this);
    this.localDisconnected = this.localDisconnected.bind(this);
    this.handleOpenSendFile = this.handleOpenSendFile.bind(this);
    this.handleCloseSendFile = this.handleCloseSendFile.bind(this);
    this.participantConnected = this.participantConnected.bind(this);
    this.participantDisconnected = this.participantDisconnected.bind(this);
    this.detachLocalParticipantTracks = this.detachLocalParticipantTracks.bind(this);
    this.handleViewsOne = this.handleViewsOne.bind(this)
    this.handleViewsAll = this.handleViewsAll.bind(this)
  }

  componentDidMount() {
    if (!this.props.userName) {
      this.props.history.push("/");
    }
    //flag of mounted component
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
      console.log("RESULT", results);
      if (this._isMounted)
        this.setState({ identity, token }, () => this.joinRoom());
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.viewsAll !== this.state.viewsAll) {
      if (this.state.viewsAll) {
        let pContainer = document.querySelector('#remote-media')
        document.querySelector('#main-media video').style.display = 'none'
        let participants = document.querySelectorAll('#remote-media video')
        pContainer.style.position = 'absolute'
        pContainer.style.display = 'grid'
        pContainer.style['justify-items'] = 'start'
        pContainer.style.width = '88vw'
        pContainer.style.height = '93vh'
        pContainer.style.zIndex = '0'
        pContainer.style.right = '10px'
        pContainer.style.top = '40px'
        participants.forEach(participant => {
          if (participants.length < 3) {
            pContainer.style['grid-template-columns'] = '1fr 1fr'
            participant.style.width = '450px'
            participant.style.height = 'auto'
          } else if (participants.length >= 3) {
            pContainer.style['grid-template-columns'] = '1fr 1fr'
            pContainer.style['grid-template-rows'] = '1fr 1fr'
            pContainer.style['justify-items'] = 'center'
            participant.style.width = '300px'
            participant.style.height = 'auto'
          }
        })
      } else {
        let pContainer = document.querySelector('#remote-media')
        if (pContainer) {
          document.querySelector('#main-media video').style.display = 'inline'
          let participants = document.querySelectorAll('#remote-media video')
          pContainer.style.position = ''
          pContainer.style.display = ''
          pContainer.style['justify-items'] = ''
          pContainer.style.width = ''
          pContainer.style.height = ''
          pContainer.style.zIndex = ''
          pContainer.style.right = ''
          pContainer.style.top = ''
          pContainer.style['grid-template-columns'] = ''
          participants.forEach(participant => {
            participant.style.width = '120px'
            participant.style.height = '90px'
          })
        }
      }
    }
  }
  componentWillUnmount() {
    this._isMounted = false
  }

  joinRoom() {
    let connectOptions = {
      name: this.state.roomName
    };

    Video.connect(this.state.token, connectOptions).then(room => {
      this.setState({ permisos: true }, () => {
        var previewContainer = this.refs.localMedia;
        if (!previewContainer.querySelector("video")) {
          this.attachLocalParticipantTracks(
            room.localParticipant,
            previewContainer
          );
          this.setState({
            localId: room.localParticipant,
            activeRoom: room,
            container: previewContainer
          });
        }
      })


      room.on("participantConnected", this.participantConnected);

      room.participants.forEach(this.participantConnected);
     

      room.on("participantDisconnected", this.participantDisconnected);

      room.once("disconnected", error =>
        room.participants.forEach(this.participantDisconnected)
      );
    });
  }
  //attach the local track to the room
  attachLocalParticipantTracks(participant, container) {
    var tracks = Array.from(participant.tracks.values());
    tracks.forEach(track => {
      container.appendChild(track.track.attach());
    });
  }
  //detach the local track to the room
  detachLocalParticipantTracks() {
    var tracks = Array.from(this.state.localId.tracks.values());
    tracks.forEach(track => {
      const attachedElements = track.track.detach();
      attachedElements.forEach(element => element.remove());
      this.props.history.push("/");
    });
  }

  // LocalVideo Disable
  videoDisable(e) {
    let img = new Image();
    img.src = "/utils/images/video.svg";
    img.id = "local-icon";
    //flag for Video Disabling
    this.state.Video == true
      ? this.state.localId.videoTracks.forEach(videoTracks => {
        videoTracks.track.disable();
        this.trackUnsubscribed(videoTracks.track);
        this.state.container.appendChild(videoTracks.track.attach(img));
        this.setState({ Video: false });
      })
      : this.state.localId.videoTracks.forEach(videoTracks => {
        document.getElementById(img.id).remove();
        this.state.container.appendChild(videoTracks.track.attach());
        videoTracks.track.enable();
        this.setState({ Video: true });
      });
    document.getElementById("videocam").classList.toggle("show");
  }
  //LocalAudio Disable
  audioDisable() {
    let micro = new Image();
    micro.src = "/utils/images/mute.svg";
    micro.id = "micro";
    //Flag for Audio Disabling
    this.state.audio == true
      ? this.state.localId.audioTracks.forEach(audioTracks => {
        audioTracks.track.disable();
        this.state.container.appendChild(micro);
        this.setState({ audio: false });
      })
      : this.state.localId.audioTracks.forEach(audioTracks => {
        audioTracks.track.enable();
        document.getElementById("micro").remove();
        this.setState({ audio: true });
      });
    document.getElementById("mic").classList.toggle("show");
  }

  // the Function speaks for itselft
  localDisconnected() {
    this.detachLocalParticipantTracks();
    document.getElementById("local-media").remove();
    this.state.activeRoom.disconnect();
    this.setState({ activeRoom: false });
  }

  //Manage Participants properties
  participantConnected(participant) {
    this.setState({ participants: true })
    const div = document.createElement("div");
    const div2 = document.createElement("h6");
    div.id = participant.sid;
    div.style.position = 'relative'
    div.onclick = (e) => {
      document.getElementById("main-media").innerHTML=""
      this.mainScreen(participant)}

    div2.innerText = participant.identity;
    // firebase.database().ref(`rooms/${this.state.roomName}/messages/`).on('value', snapshoot => {
    //   const actMsj = snapshoot.val().length ? snapshoot.val().length : 0
    //   const newMessage = {
    //     id: actMsj,
    //     username: participant.identity,
    //     textMessage: 'Ha ingresado a la sala',
    //     time: moment().format('LT')
    //   }
    //   firebase.database().ref(`rooms/${this.state.roomName}/messages/${newMessage.id}`)
    //   .set(newMessage)
    // })
    participant.on("trackSubscribed", track => {
      this.trackSubscribed(div, track);
    });
    participant.on("trackUnsubscribed", this.trackUnsubscribed);
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        trackSubscribed(div, publication.track);

      }
    });
    if (this.state.main == false) {
      //this.state.main is  flag  to only have one mainScreen ,later on the functions is change to True
      this.mainScreen(participant);
    }
    let remoteMedias = document.getElementById("remote-media");
    remoteMedias.appendChild(div);
    div.appendChild(div2);
  }

  //Manage MainScreen  properties
  mainScreen(participant) {
    this.state.main = true;
    const div = document.createElement("div");
    //changes the Div ID  to make a manageable syntax
    div.id = "main";
    participant.on("trackSubscribed", track => {
      this.trackSubscribed(div, track);
    });
    participant.on("trackUnsubscribed", this.trackUnsubscribed);
    participant.tracks.forEach(publication => {
      if (publication.isSubscribed) {
        this.trackSubscribed(div, publication.track);
      }
    });

    let remoteMedias = document.getElementById("main-media");
    remoteMedias.appendChild(div);
    // let video = document.querySelector('# main video')
    // video.webkitEnterFullscreen()
  }

  //Select a MainScreen ??
  onClick(track) {
    
  }

  participantDisconnected(participant) {
    //Flag for mainScreen
    this.state.main = false;
    document.getElementById(participant.sid).remove();
  }

  //Select a MainScreen ??
  onClick(track) {
    console.log("12312312", track);
    console.log(document.getElementById(track));
    if (this.state.viewsAll) return
    document.getElementById("remote-media");
  }

  //Attaching and Detaching participants tracks
  trackSubscribed(div, track) {
    let img = new Image();
    img.src = "/utils/images/video.svg";
    img.id = "remote-icon";
    let bigImg = new Image();
    bigImg.src = "/utils/images/video.svg";
    bigImg.id = "remote-icon";
    let micro = new Image();
    micro.src = "/utils/images/mute.svg";
    micro.id = "micro";
    micro.style.zIndex = "initial";
    // div.style.position = "absolute";

   
    if (track.kind == "audio") {
      track.isEnabled
        ? div.appendChild(track.attach())
        : div.appendChild(track.attach(micro));
    }
    if (track.kind == "video") {
      track.isEnabled
        ? div.appendChild(track.attach())
        : div.appendChild(track.attach(img));
    }
    //waiting for  events from other Participants

    track.on("disabled", () => {
      if (track.kind == "video") {
        this.trackUnsubscribed(track);
        div.id !== "main" ? div.appendChild(img) : div.appendChild(bigImg);
      } else {
        div.appendChild(track.attach(micro));
      }
    });
    track.on("enabled", () => {
      if (track.kind == "video") {
        track.detach(img).remove();
        track.detach(bigImg).remove();
        div.appendChild(track.attach());
      } else {
        track.detach(micro).remove();
      }
    });
  }

  trackUnsubscribed(track) {
    track.on('enabled', (e) => {
      console.log(e, track)
    })
    track.detach().forEach(element => element.remove());
  }
  handleViewsAll() {
    this.setState({ viewsAll: true })
  }
  handleViewsOne() {
    this.setState({ viewsAll: false })
  }
  handleOpenSendFile() {
    this.setState({ sendFileOpen: true });
  }
  handleCloseSendFile() {
    this.setState({ sendFileOpen: false });
  }

  render() {
    const { permisos, participants } = this.state
    return (
      <div className='streaming'>
        {permisos ?
          <div className="Views">
            <div className="logoVideoConferencia">
              <div className="logoConferencia">
                <img className="logoConferencia" src="/utils/images/logor.png" />
              </div>
            </div>
            <div className="divDelMedio">
              {/* {participants ? */}
                < div className="opcionesVista">
                  <Button
                    onClick={this.handleViewsAll}
                    style={{ float: "right", marginTop: "12px" }}
                  >
                    <img className="add-participant" src="/utils/images/layout.svg" />
                  </Button>
                  <Button
                    onClick={this.handleViewsOne}
                    style={{ float: "right", marginTop: "12px" }}
                  >
                    <img
                      className="add-participant"
                      src="/utils/images/layout-full.svg"
                    />
                  </Button>
                </div>


                {/* :
                <SalaEspera />} */}
              <div className="participantes">
                <AddParticipant dataSala={this.props.match.params.code} />
                <div id="totalRemote">
                  <div
                    onClick={e => this.onClick(e.target)}
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
                <Route
                  path={`/room/${this.props.match.params.code}`}
                  render={() => <Chat room={this.props.match.params.code} />}
                />
              </div>
              {/* AQUI SE MUESTRA LA BARRA DE OPCIONES */}
              <div className="barraOpciones">
                <ButtonBar
                  history={this.props.history}
                  disconnect={this.localDisconnected}
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
                <div id="ellocal">{this.props.userName} </div>
                <div ref="localMedia" id="local-media" />
              </div>
            </div>
            <div ref="mainmedia" id="main-media" />
          </div >
          :
          <Permisos />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userLogin: state.firebase.auth,
})

const mapDispatchToProps = (dispatch) => ({
})

export default compose(firebaseConnect([
  'rooms']),
  connect(mapStateToProps, mapDispatchToProps))(VideoComponent)
