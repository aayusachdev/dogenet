import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import PostScream from '../scream/PostScream';

// MUI stuff
import Appbar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';


// Icons
import HomeIcon from '@material-ui/icons/Home';
import Notifications from '@material-ui/icons/Notifications';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';

// Redux stuff
import { connect } from 'react-redux';

class Navbar extends Component {
  render() {
    const { authenticated } = this.props;

    return (
      <Appbar className="navbar" color="secondary" position="fixed">
        <Toolbar className="nav-container">
          {authenticated ? (
            <>
             <PostScream />

              <Link to="/">
                <Tooltip title={"Home"}>
                  <IconButton>
                    <HomeIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Link>

              <Tooltip title={"Notifications"}>
                <IconButton>
                  <Notifications color="primary" />
                </IconButton>
              </Tooltip>

              <Tooltip title={"Web Chat"}>
                <IconButton>
                  <WhatsAppIcon color="primary" />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
            </>
          )}
        </Toolbar>
      </Appbar>
    )
  }
}

Navbar.propTypes = {
  authenticated: propTypes.bool.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

const mapActionsToProps = {

};

export default connect(mapStateToProps, mapActionsToProps)(Navbar);