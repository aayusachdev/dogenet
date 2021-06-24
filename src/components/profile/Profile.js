import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import EditDetails from './EditDetails';

// MUI stuff
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';
import LinkIcon from '@material-ui/icons/Link';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';


// Redux Stuff
import { connect } from 'react-redux';
import { uploadImage, logoutUser } from '../../redux/actions/userActions';

const styles = (theme) => ({
  paper: {
    padding: 20,
    backgroundColor: '#14141c',
    borderRadius: '8px',
    boxShadow: '12px 12px 16px 0 rgba(0, 0, 0, 0.25),-2px -2px 6px 0 rgba(255, 255, 255, 0.1)',
    color: '#f2f2f2'
  },
  profile: {
    '& .image-wrapper': {
      textAlign: 'center',
      position: 'relative',
      '& button': {
        position: 'absolute',
        top: '80%',
        left: '70%'
      }
    },
    '& .profile-image': {
      width: 200,
      height: 200,
      objectFit: 'cover',
      maxWidth: '100%',
      borderRadius: '50%'
    },
    '& .profile-details': {
      textAlign: 'center',
      '& span, svg': {
        verticalAlign: 'middle'
      },
      '& a': {
        color: '#00bcd4'
      }
    },
    '& hr': {
      border: 'none',
      margin: '0 0 10px 0'
    },
    '& svg.button': {
      '&:hover': {
        cursor: 'pointer'
      }
    }
  },
  buttons: {
    textAlign: 'center',
    '& a': {
      margin: '20px 10px'
    }
  }
});

class Profile extends Component {

  handleImageChange = (event) => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);
  }

  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  }
  render() {
    // console.log(this.props);
    const {
      classes,
      user: {
        authenticated,
        credentails: { handle, createdAt, bio, location, website, imageURL },
        loading
      }
    } = this.props;

    let profileMarkup = !loading ? (authenticated ? (
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageURL} alt="profile" className="profile-image" />
            <input
              type="file"
              id="imageInput"
              onChange={this.handleImageChange}
              hidden="hidden"
            />
            <Tooltip title="Edit profile picture" placement="top">
              <IconButton onClick={this.handleEditPicture} className="button">
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          </div>
          <hr />
          <div className="profile-details">
            <MuiLink component={Link} to={`/user/${handle}`} color="primary" variant="h5">
              @{handle}
            </MuiLink>
            <hr />
            {bio && <Typography variant="body2">{bio}</Typography>}
            <hr />
            {location && (<>
              <LocationOn color="primary" /><span>{location}</span>
              <hr />
            </>)}
            {website && (<>
              <LinkIcon color="primary" />
              <a href={website} targer="_blank" rel="noopener noreferrer">
                {' '}{website}
              </a>
              <hr />
            </>)}
            <CalendarToday color="primary" />{' '}
            <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
          </div>

          <Tooltip title="Logout from Application" placement="top">
              <IconButton onClick={this.props.logoutUser} className="button">
                <KeyboardReturn color="primary" />
              </IconButton>
          </Tooltip>
          <EditDetails/>
        </div>
      </Paper>
    ) : (
      <Paper className={classes.paper}>
        <Typography variant="body2" align="center">
          No profile found, please login again
        </Typography>
        <div className={classes.buttons}>
          <Button variant="contained" color="primary" component={Link} to="/login">Login</Button>
          <Button variant="contained" color="secondary" component={Link} to="/signup">Signup</Button>
        </div>
      </Paper>
    )) : (<p>Loading...</p>);
    return profileMarkup;
  }
}

Profile.propTypes = {
  user: propTypes.object.isRequired,
  classes: propTypes.object.isRequired,
  logoutUser: propTypes.func.isRequired,
  uploadImage: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  uploadImage,
  logoutUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(Profile));