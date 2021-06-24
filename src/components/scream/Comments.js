import React, { Component, Fragment } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

// Icons

// Redux stuff

const styles = (theme) => ({
  ...theme.styles,
  commentImage: {
    height: '70px',
    width: '70px',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  commentData: {
    marginLeft: '20px'
  },
  commentItem: {
    margin: '0.7rem 0px'
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
  }

});

class Comments extends Component {
  render() {
    const { comments, classes } = this.props;
    return (
      <>
        <Grid container>
          {comments.map(comment => {
            const { body, createdAt, userImage, userHandle } = comment;
            return (
              <Fragment key={createdAt}>
                <Grid item sm={12}>
                  <Grid container className={classes.commentItem}>
                    <Grid item sm={2} style={{'alignSelf': 'center'}}>
                      <img src={userImage} alt="comment" className={classes.commentImage} />
                    </Grid>
                    <Grid item sm={9}>
                      <div className={classes.commentData}>
                        <Typography variant="body1"
                          component={Link}
                          to={`/user/${userHandle}`}
                          color="primary"
                        >
                          {userHandle}
                        </Typography>
                        <Typography variant="body2" className={classes.timestamp}>
                          {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                        </Typography>
                        <hr className={classes.invisibleSeparator} />
                        <Typography variant="body1">
                          {body}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <hr className={classes.visibleSeparator}/>
              </Fragment>)
          })}
        </Grid>
      </>
    )
  }
}

Comments.propTypes = {
  comments: propTypes.array.isRequired,
  classes: propTypes.object.isRequired,
};


export default withStyles(styles)(Comments);