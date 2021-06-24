import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import propTypes from 'prop-types';
import MyButton from '../../util/myButton';
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';
import LikeButton from './LikeButton';

// MUI stuff
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

// Icons
import ChatIcon from '@material-ui/icons/Chat';

// Redux stuff
import { connect } from 'react-redux';

const styles = {
  card: {
    display: 'flex',
    marginBottom: 20,
    position: 'relative',
    backgroundColor: '#14141c',
    borderRadius: '8px',
    boxShadow: '12px 12px 16px 0 rgba(0, 0, 0, 0.25),-2px -2px 6px 0 rgba(255, 255, 255, 0.1)',
    color: '#d3d3d3e0',
    maxHeight: '130px'
  },
  image: {
    minWidth: 130,
    objectFit: 'cover',
    borderRadius: '12%',
    margin: '6px'
  },
  handle: {
    fontWeight: 500,
    color: '#16CFF7'
  },
  timestamp: {
    color: 'gray',
    fontSize: '12px',
  },
  content: {
    padding: '7px 20px'
  }
};

export class Scream extends Component {

  render() {
    dayjs.extend(relativeTime);

    const {
      classes,
      scream: {
        body,
        createdAt,
        userImage,
        userHandle,
        likeCount,
        commentCount,
        screamId },
      user: {
        authenticated,
        credentails: {
          handle
        }
      }
    } = this.props;

    const deleteButton = authenticated && userHandle === handle ? (
        <DeleteScream screamId={screamId} fontSize="small"/>
    ) : null;

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title="Profile image"
          className={classes.image} />
        <CardContent className={classes.content}>
          <Typography
            color="secondary"
            variant="h6"
            className={classes.handle}
            component={Link} to={`/user/${userHandle}`} >
            {userHandle}
          </Typography>

          <Typography display="inline" variant="body2">{deleteButton}</Typography>

          <Typography variant="body2" className={classes.timestamp}>
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">
            {body}
          </Typography>
         <LikeButton screamId={screamId} />
          <Typography display="inline" variant="body2">{likeCount} likes</Typography>
          <MyButton tip="comments">
            <ChatIcon color="primary" fontSize="small" />
          </MyButton>
          <Typography display="inline" variant="body2">{commentCount} comments</Typography>
          <ScreamDialog screamId={screamId} userHandle={handle} />

        </CardContent>
      </Card>
    )
  }
}

Scream.propTypes = {
  user: propTypes.object.isRequired,
  scream: propTypes.object.isRequired,
  classes: propTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
})


export default connect(mapStateToProps, null)(withStyles(styles)(Scream));
