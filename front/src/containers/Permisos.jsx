import React from 'react'

class Permisos extends React.Component {

	render() {
		const { statePermissions } = this.props
		return (
				<div id='permisos' >
					<div id='centrando-permiso'>
						<img className='watermark' src='/utils/images/logor.png' />
					</div>
					<div className='iconos'>
				
							<img id='video-camera' src="/utils/images/video-camera.svg" />
	
							<img id='microphone' src="/utils/images/microphone.svg" />
						
					</div>
					<h4 id='text-permisos'>Para ingresar debe permitir el uso de su cámara y micrófono</h4>
				</div>
		)
	}
}

export default Permisos;