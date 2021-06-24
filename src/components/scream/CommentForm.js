import React, { Component } from 'react';
import propTypes from 'prop-types';
import withStyles from '@material-ui/styles/withStyles';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

// Icons
import SendIcon from '@material-ui/icons/Send';

// Redux stuff
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

const styles = theme => ({
  ...theme.styles,
  CommentField: {
    width: '90%'
  }
});

class CommentForm extends Component {
  state = {
    body: '',
    errors: {}
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.submitComment(this.props.screamId, { body: this.state.body });
    this.setState({ body: '' });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
    if (!nextProps.UI.errors) {
      this.setState({ body: '', errors: {} });
    }
  }

  render() {
    const { classes, authenticated } = this.props;
    const { errors } = this.state;
    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} >
        <form onSubmit={this.handleSubmit}>
          <TextField
            name="body"
            type="text"
            label="Comment on scream"
            error={errors.body ? true : false}
            helperText={errors.body}
            value={this.state.body}
            onChange={this.handleChange}
            className={classes.CommentField}
          />
          <IconButton type="submit">
            <SendIcon color="primary" />
          </IconButton>
        </form>
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

CommentForm.propTypes = {
  screamId: propTypes.string.isRequired,
  UI: propTypes.object.isRequired,
  authenticated: propTypes.bool.isRequired,
  classes: propTypes.object.isRequired,
  submitComment: propTypes.func.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI,
  authenticated: state.user.authenticated
});

const mapActionsToProps = {
  submitComment
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(CommentForm));