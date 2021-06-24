import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import propTypes from 'prop-types';
import MyButton from '../../util/myButton';
import LikeButton from './LikeButton';
import Comments from './Comments';
import CommentForm from './CommentForm';

// MUI stuff
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import CloseIcon from '@material-ui/icons/Close';
import ChatIcon from '@material-ui/icons/Chat';

// Redux stuff
import { connect } from 'react-redux';
import { getScream, clearErrors } from '../../redux/actions/dataActions';

const styles = (theme)=> ({
  ...theme.styles,
  closebutton: {
    position: 'absolute',
    left: '88%',
    top: '5%',
    color:'#f2f2f2'
  },
  dialogContent: {
    padding: 36,
    backgroundColor: '#14141c',
    color: '#f2f2f2'
  },
  profileImage: {
    borderRadius: '15%',
    maxWidth: 300,
    maxHeight: 300,
    objectFit: 'cover' // Just in case the ratio doesn't match, it doesn't strech the image.
  },
  invisibleSeparator: {
    border: "none",
    margin: 4
  },
  visibleSeparator: {
    borderTop: "1px solid #16CFF7",
    borderRight: "none",
    borderBottom : "none",
    borderLeft : "none",
    margin: 4,
    width: '100%',
  },
  timestamp: {
    color: 'gray',
    fontSize: '14px',
  },
  expandButton: {
    position: 'absolute',
    left: '93%',
  },
  spinnerDiv: {
    textAlign: 'center',
    margin: "50px 0px"
  }
});

class ScreamDialog extends React.Component {

  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
    this.props.getScream(this.props.screamId);
  }

  handleClose = () => {
    this.setState({ open: false });
    this.props.clearErrors();
  }

  render() {
    const { classes,
      scream: {
        commentCount,
        comments,
        createdAt,
        likeCount,
        screamId,
        userHandle,
        userImage,
        body
      },
      UI: {
        loading
      } } = this.props;

    const dialogMarkup = loading ? (
      <div className={classes.spinnerDiv}>
        <CircularProgress style={{ "margin":"0 auto" }} size={100} thickness={2}/>
      </div>
    ) : (
        <Grid container spacing={16}>
          <Grid item sm={5}>
            <img src={userImage} alt="Profile" className={classes.profileImage} />
          </Grid>
          <Grid item sm={5}>
          <Typography
            color="primary"
            variant="h6"
            className={classes.handle}
            component={Link} to={`/user/${userHandle}`} >
            @{userHandle}
          </Typography>
          <hr className={classes.visibleSeparator} />

          <Typography variant="body2" className={classes.timestamp}>
            {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
          </Typography>
            <hr className={classes.invisibleSeparator} />
            <Typography variant="body1">
            {body}
            </Typography>
            <LikeButton screamId={screamId} />
            <Typography display="inline" variant="body2">{likeCount} likes</Typography>
            <MyButton tip="comments">
            <ChatIcon color="primary" fontSize="small" />
          </MyButton>
          <Typography display="inline" variant="body2">{commentCount} comments</Typography>
          </Grid>
          <hr className={classes.visibleSeparator} />
          <CommentForm screamId= {screamId} />
          <Comments comments={comments} />
        </Grid>
      )

    return (<>
      <MyButton onClick={this.handleOpen} tip="See scream" tipClassName={classes.expandButton}>
        <OpenInNewIcon fontSize="small" color="primary" />
      </MyButton>

      <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <MyButton tip="close" onClick={this.handleClose} tipClassName={classes.closebutton}>
            <CloseIcon />
          </MyButton>
          <DialogContent className={classes.dialogContent}>
            {dialogMarkup}
          </DialogContent>
      </Dialog>

    </>)
  }
}

ScreamDialog.propTypes = {
  getScream: propTypes.func.isRequired,
  clearErrors: propTypes.func.isRequired,
  screamId: propTypes.string.isRequired,
  scream: propTypes.object.isRequired,
  classes: propTypes.object.isRequired,
  UI: propTypes.object.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI,
  scream: state.data.scream
})

const mapActionsToProps = {
  getScream,
  clearErrors // to clear any errors in the redux state when closing the modal
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(ScreamDialog));