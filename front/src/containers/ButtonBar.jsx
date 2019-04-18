import React, { Component } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { setCallTime } from '../redux/action-creators/roomsActions'

const styles = theme => ({
  timeCall: {
    width: 100,
    height: 64,
    borderRadius: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)"
  },
  micCam: {
    width: 100,
    height: 64,
    borderRadius: 0,
    backgroundColor: "rgba(55, 55, 55, 0.8)"
  },
  icons: {
    height: 30,
    width: 29,
    objectFit: "contain",
    float: 'rigth'
  },
  timer: {
    fontFamily: "Roboto",
    fontSize: 18,
    fontWeight: 900,
    fontStyle: "normal",
    fontStretch: "normal",
    lineHeight: "normal",
    letterSpacing: "normal",
    textAlign: "center",
    color: "#ffffff"
  }
});

export class ButtonBar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      timer: 0,
    }
    this.endCall = this.endCall.bind(this)
  }

  componentDidMount() {
    this.intervalID = setInterval(() => this.setState({timer: this.state.timer + 1}), 1000)
  }

  componentWillUnmount(){
    clearInterval(this.intervalID)
  }

  format(time) {
    let seg = time / 1 | 0;
    if (seg>59) seg = seg % 60;
    if (seg/10 < 1) seg = '0' + seg;
    let min = time / 60 | 0;
    if (min/10 < 1) min = '0' + min;
    return `${min}:${seg}`;
  }

  endCall(){
    console.log('BOTON!!!!!', this.props)
    this.props.setCallTime(this.format(this.state.timer))
    this.props.disconnect()
    this.props.history.push('/endcall')
  }

  render() {
    const { classes } = this.props
    const { timer } = this.state
    return (
      <div>
        <Button className={classes.timeCall}><p className={classes.timer}>{this.format(timer)}</p></Button>
        <Button className={classes.micCam}>
          <img
            onClick={this.props.videoDisable}
            src="/utils/images/video.svg"
            className={classes.icons}
          />
        </Button>
        <Button className={classes.micCam}>
          <img
            onClick={this.props.audioDisable}
            src="/utils/images/mute.svg"
            className={classes.icons}
          />
        </Button>
        <Button className={classes.micCam} onClick={() => this.props.handleOpenSendFile()}><img src="/utils/images/share-screen.svg" className={classes.icons} /></Button>
        <Button className={classes.timeCall} onClick={this.endCall}>
          <img src="/utils/images/end-call.svg" className={classes.icons} />
        </Button>
      </div>
    );
  }
}



const mapStateToProps = state => ({});

function mapDispatchToProps(dispatch) {
  return {
    setCallTime: time => dispatch(setCallTime(time))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ButtonBar));
