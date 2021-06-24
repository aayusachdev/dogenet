import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import MyButton from '../../util/myButton';

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

// Redux stuff
import { connect } from 'react-redux';
import { likeScream, unlikeScream } from '../../redux/actions/dataActions';


class LikeButton extends Component {

  likedScream = () => {
    if (this.props.user.likes &&
      this.props.user.likes.find(like => like.screamId === this.props.screamId))
      return true;
    return false;
  };

  likeScream = () => {
    this.props.likeScream(this.props.screamId);
  }

  unlikeScream = () => {
    this.props.unlikeScream(this.props.screamId);
  }

  render() {
    const { user:
      { authenticated }
    } = this.props;

    const likeButton = !authenticated ? (
      <MyButton tip="Like">
        <Link to="/login">
          <FavoriteBorderIcon color="primary" fontSize="small" />
        </Link>
      </MyButton>
    ) : (
      this.likedScream() ? (
        <MyButton tip="unlike" onClick={this.unlikeScream}>
          <FavoriteIcon color="primary" fontSize="small" />
        </MyButton>
      ) : (
        <MyButton tip="like" onClick={this.likeScream}>
          <FavoriteBorderIcon color="primary" fontSize="small" />
        </MyButton>
      )
    )
    return likeButton;
  }
}

LikeButton.propTypes = {
  user: propTypes.object.isRequired,
  screamId: propTypes.string.isRequired,
  likeScream: propTypes.func.isRequired,
  unlikeScream: propTypes.func.isRequired,
}

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likeScream,
  unlikeScream
}

export default connect(mapStateToProps, mapActionsToProps)(LikeButton);
