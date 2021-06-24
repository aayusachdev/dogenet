import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles'
import propTypes from 'prop-types';

// MUI stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

// Icons
import EditIcon from '@material-ui/icons/Edit';

// Redux stuff
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

const styles = (theme) => ({
  ...theme.styles,
  profileDialog: {
    padding: 20,
    backgroundColor: '#14141c',
    color: '#f2f2f2'
  },
  button: {
    textAlign: 'center',
    '& a': {
      margin: '20px 10px'
    },
    float: 'right'
  },
  TextField: {
    marginTop: '22px'
  }
});


class EditDetails extends React.Component {

  constructor() {
    super();
    this.state = {
      bio: '',
      location: '',
      website: '',
      open: false
    };
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState(this.props.credentails);
  }

  handleClose = () => {
    this.setState({ open: false });
  }


  // Populating component state related to credentails from the redux state
  mapUserDetailsToState(credentails) {
    this.setState({
      bio: credentails.bio ? credentails.bio : "",
      website: credentails.website ? credentails.website : "",
      location: credentails.location ? credentails.location : "",
    });
  }

  componentDidMount() {
    const { credentails } = this.props;
    this.mapUserDetailsToState(credentails);
  };


  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  };

  handleSubmit = () => {
    const userDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location
    };
    this.props.editUserDetails(userDetails);
    this.handleClose();
  }

  render() {
    const { classes } = this.props;
    return (
      <>
        <Tooltip title="Edit Profile" placement="top">
          <IconButton color="primary" onClick={this.handleOpen} className={classes.button}>
            <EditIcon color="primary" />
          </IconButton>
        </Tooltip>

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle className={classes.profileDialog}>Edit Profile details</DialogTitle>
          <DialogContent className={classes.profileDialog}>
            <form>
              <TextField
                name="bio"
                type="text"
                label="Bio"
                placeholder="A short bio about yourself"
                className={classes.TextField}
                value={this.state.bio}
                onChange={this.handleChange}
                fullWidth

              />
               <TextField
                name="website"
                type="text"
                label="Website"
                placeholder="Your personal/professional website"
                className={classes.TextField}
                value={this.state.website}
                onChange={this.handleChange}
                fullWidth
                autoFocus
              />
               <TextField
                name="location"
                type="text"
                label="Location"
                placeholder="Where do you live"
                className={classes.TextField}
                value={this.state.location}
                onChange={this.handleChange}
                fullWidth
                autoFocus
              />
            </form>

          </DialogContent>
          <DialogActions className={classes.profileDialog} >
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  };
}

EditDetails.propTypes = {
  editUserDetails: propTypes.func.isRequired,
  classes: propTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  credentails: state.user.credentails
});

const mapActionsToProps = {
  editUserDetails
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(EditDetails));