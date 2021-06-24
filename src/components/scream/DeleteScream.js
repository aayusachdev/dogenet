import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import propTypes from 'prop-types';
import MyButton from '../../util/myButton';

// MUI stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

// Icons
import MoreVertIcon from '@material-ui/icons/MoreVert';

// Redux stuff
import { connect } from 'react-redux';
import { deleteScream } from '../../redux/actions/dataActions';

const styles = (theme) => ({
  ...theme.styles,
  deleteDialog: {
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
  deleteButton: {
    left: '93%',
    top: '5%',
    position: 'absolute'
  }
});

class DeleteScream extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false
    }
  };

  handleOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  deleteScream = () => {
    this.props.deleteScream(this.props.screamId);
    this.handleClose();
  }

  render() {
    const { classes } = this.props;

    return (
      <>
        <MyButton tip="Delete Scream"
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <MoreVertIcon style={{ "color": "#ffcccb" }} />
        </MyButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle className={classes.deleteDialog}>
            Are you sure you want to delete this scream ?
          </DialogTitle>
          <DialogActions className={classes.deleteDialog}>
            <Button onClick={() => this.handleClose()} color="primary">Cancel</Button>
            <Button onClick={() => this.deleteScream()} color="primary">Delete</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

DeleteScream.propTypes = {
  deleteScream: propTypes.func.isRequired,
  screamId: propTypes.string.isRequired,
  classes: propTypes.object.isRequired
};

const mapActionsToProps = {
  deleteScream
};

export default connect(null, mapActionsToProps)(withStyles(styles)(DeleteScream));