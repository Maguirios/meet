import React from 'react'
import { connect } from "react-redux";


function EndCall(props) {
    setTimeout(() => props.history.push('/'), 5000)
    return (
    <div className = 'endCall'>
      <div>
        <img src='/utils/images/logor.png' style={{width:'100px'}}/>
      </div>
      <div>
          <p className = 'llamadaFinalizada'>Llamada finalizada</p>
          <p className = 'llamadaFinalizada'>{props.callTime} min.</p>
      </div>
    </div>
  )
}
const mapStateToProps = state => ({
    callTime: state.rooms.callTime
});

function mapDispatchToProps(dispatch) {
  return {
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(EndCall);
