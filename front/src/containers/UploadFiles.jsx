import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import firebase from '../firebase'

const styles = theme => ({
  uploadContainer: {
    display: 'grid',
    width: 446,
    height: 348,
    borderRadius: 5,
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.5)',
    backgroundColor: '#ffffff',
    padding: '10px',
    'grid-template-rows': '1fr 4fr'
  },
  headerUpload: {
    display: 'grid',
    'grid-template-columns': '2fr 1fr'
  },
  contentUploadContainer: {
    display: 'grid',
    alignItems: 'center',
    justifyItems: 'center'
  },
  contentUpload: {
    width: 326,
    height: 192,
    borderRadius: 5,
    border: 'dashed 1px #8d9aa3',
    display: 'grid',
    alignItems: 'center',
    justifyItems: 'center',
    fontFamily: 'Roboto'
  },
  titleUpload: {
    marginLeft: 20,
    width: 150,
    height: 19,
    fontFamily: 'Roboto',
    fontSize: 14,
    fontStyle: 'normal',
    fontStretch: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal',
    color: '#8d9aa3',
  },
  cancelContainer: {
    display: 'grid',
    justifyItems: 'end'
  },
  cancel: {
    fontFamily: 'Nunito',
    width: 15,
    height: 15,
    color: '#8d9aa3',
    margin: 10,
  },
  input: {
    display: 'none',
  },
});

class UploadFiles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      file: {}
    }
    this.handleChange = this.handleChange.bind(this)
    this.drop = this.drop.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  drop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    this.setState({ file: file })
  }

  handleChange(e) {
    e.preventDefault()
    const file = e.target.files[0]
    this.setState({ file: file })  
  }

  handleSubmit(e){
    e.preventDefault()
    const file = this.state.file
    var storageRef = firebase.storage().ref('meet/' + file.name)
    storageRef.put(file)
  }
  render() {
    const { classes } = this.props
    console.log('estado', this.state)
    return (
      <div className={classes.uploadContainer} >
        <div className={classes.headerUpload}>
          <p className={classes.titleUpload}>ENVIAR ARCHIVO</p>
          <div className={classes.cancelContainer}>
            <p className={classes.cancel}>X</p>
          </div>
        </div>
        <section className={classes.contentUploadContainer}>
          <div
            className={classes.contentUpload}
            onDrop={this.drop}
            onDragEnter={(e) => e.preventDefault()}
            onDragOver={(e) => e.preventDefault()}
          >
            <div>
              {(this.state.file.name) ? 
                <div>
                  {this.state.file.name} 
                  <p style={{textAlign: "center"}}>{(this.state.file.size / 1024).toFixed(2) + ' KB'}</p>
                </div>
                : 
                'Arrastra un archivo para subir'}
            </div>
            <div>
              <input
                className={classes.input}
                id="contained-button-file"
                name='file'
                type="file"
                onChange={this.handleChange}
              />
              {(!this.state.file.name) ?
                <label htmlFor="contained-button-file">
                  <Button variant="contained" color='primary' component="span">
                    Seleccionar Archivo
                  </Button>
                </label> 
                :
                <Button onClick={this.handleSubmit} color='primary' variant="contained" >
                  Subir
                </Button>
              }

            </div>
          </div>
        </section>
      </div>
    )

  }
}

UploadFiles.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UploadFiles);