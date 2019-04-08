import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import Grid from '@material-ui/core/Grid';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const styles = theme => ({
  toggleContainer: {
    height: 56,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    margin: `${theme.spacing.unit}px 0`,
    background: theme.palette.background.default,
  },
});

class ToggleButtons extends React.Component {
  // state = {
  //   alignment: 'left',
  //   formats: ['bold'],
  // };

  // handleFormat = (event, formats) => this.setState({ formats });

  // handleAlignment = (event, alignment) => this.setState({ alignment });

  render() {
    const { onClick } = this.props

    return (
      <Grid container spacing={16}>
        <Grid item xs={12} sm={6}>
          <div >
            <ToggleButtonGroup id='barra-icons'>
              <ToggleButton id='hour-icon' value="center">
                05:25
              </ToggleButton>

              <ToggleButton id='footer-icons' value="center">
                <i  className="material-icons">videocam_off</i>
              </ToggleButton>

              <ToggleButton id='footer-icons' value="center">
                <i className="material-icons">mic_off</i>
              </ToggleButton>

              <ToggleButton id='footer-icons' value="center">
              <i id='upload-icon' className="material-icons">exit_to_app</i>
                {/* <i  className="material-icons">open_in_browser</i> */}
              </ToggleButton>

              <ToggleButton onClick={ onClick } id='hour-icon' value="center">
                <i  id='footer-phone' className="material-icons">call_end</i>
              </ToggleButton>

            </ToggleButtonGroup>
          </div>
        </Grid>
        
      </Grid>
    );
  }
}

// ToggleButtons.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

export default withStyles(styles)(ToggleButtons);