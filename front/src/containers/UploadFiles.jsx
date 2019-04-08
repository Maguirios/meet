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
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e){
    this.setState({ [e.target.name]: e.target.files[0] })
  }

  handleSubmit (e) {
    var storageRef = firebase.storage().ref('meet/' + this.state.file.name)
    storageRef.put(file)
  }
  render() {
    const { classes } = this.props
    return (
      <div className={classes.uploadContainer} >
        <div className={classes.headerUpload}>
          <p className={classes.titleUpload}>ENVIAR ARCHIVO</p>
          <div className={classes.cancelContainer}>
            <p className={classes.cancel}>X</p>
          </div>
        </div>
        <div className={classes.contentUploadContainer}>
          <div className={classes.contentUpload}>
            <p>Arrastra un archivo para subir</p>
            <div>
              <input
                className={classes.input}
                id="contained-button-file"
                name='file'
                type="file"
                onChange = {this.handleChange}
              />
              <label htmlFor="contained-button-file">
                <Button variant="contained" color='primary' component="span" onChange={this.handleSubmit}>
                  Seleccionar Archivo
                </Button>
              </label>
            </div>
          </div>
        </div>
      </div>
    )

  }
}

UploadFiles.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UploadFiles);