import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// MUI stuff
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';

// Icons
import LocationOn from '@material-ui/icons/LocationOn';
import CalendarToday from '@material-ui/icons/CalendarToday';
import LinkIcon from '@material-ui/icons/Link';

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
  }
});


const StaticProfile = (props) => {
  const { classes,
    profile: {
      handle,
      createdAt,
      imageURL,
      bio,
      website,
      location
    } } = props;
  return (
    <>
      <Paper className={classes.paper}>
        <div className={classes.profile}>
          <div className="image-wrapper">
            <img src={imageURL} alt="profile" className="profile-image" />
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
        </div>
      </Paper>
    </>
  )
}

export default withStyles(styles)(StaticProfile);