import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles'
import propTypes from 'prop-types';
import MyButton from '../../util/myButton';

// MUI stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

// Icons
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

// Redux stuff
import { connect } from 'react-redux';
import { postScream, clearErrors } from '../../redux/actions/dataActions';

const styles = (theme) => ({
  ...theme.styles,
  submitButton: {
    position: 'relative',
    left: '88%'
  },
  progressSpinner: {
    position: 'absolute'
  },
  closebutton: {
    position: 'absolute',
    left: '88%',
    top: '5%',
    color:'#f2f2f2'
  },
  postScreamDialog: {
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
  }
});

class PostScream extends React.Component {
  state = {
    open: false,
    body: '',
    errors: {}
  };

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false, errors: {} });
    this.props.clearErrors();
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleScreamSubmit = (event) => {
    event.preventDefault();
    this.props.postScream({ body: this.state.body });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors
      });
    };
    if (!nextProps.UI.errors && !nextProps.UI.loading) {
      this.setState({ body: '', open: false, errors: {} });
    }
  }

  render() {
    const { errors } = this.state;
    const { classes,
      UI: {
        loading
      } } = this.props;
    return (
      <>
        <MyButton tip="Post a Scream" onClick={this.handleOpen}>
          <AddIcon color="primary" />
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
          <DialogTitle className={classes.postScreamDialog}>Post a new Scream</DialogTitle>
          <DialogContent className={classes.postScreamDialog}>
            <form onSubmit={this.handleScreamSubmit}>
              <TextField
                name="body"
                type="text"
                label="Sceam"
                placeholder="What's on your mind"
                helperText={errors.body}
                error={errors.body? true: false}
                className={classes.textField}
                onChange={this.handleChange}
                fullWidth
              />
              <Button
                type="submit"
                color="primary"
                className={classes.submitButton}
                disabled={loading}
              >
                Post
                {loading && (
                  <CircularProgress size={30} className={classes.progressSpinner} />
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </>
    )
  }
}

PostScream.propTypes = {
  postScream: propTypes.func.isRequired,
  UI: propTypes.object.isRequired,
  clearErrors:  propTypes.func.isRequired
};

const mapStateToProps = state => ({
  UI: state.UI
});

const mapActionsToProps = {
  postScream,
  clearErrors
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(PostScream));