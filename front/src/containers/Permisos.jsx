import React from 'react'
import { Link } from 'react-router-dom';

const Permisos = () => {
	return (
		<div className='iconos'>
			<div>
				<img className='watermark' src='/utils/images/logor.png' />
			</div>
			<div id='icon-align'>
				<Link to='#'><i id='video-icon' className="material-icons" >videocam</i></Link>
				<Link to='#'><i id='micro-icon' className="material-icons">mic_none</i></Link >
			</div>
			<h4 id='text-permisos'>Para ingresar debe permitir el uso de su cámara y micrófono</h4>
		</div>
	)
}

export default Permisos;