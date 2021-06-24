import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import propTypes from 'prop-types';
import AppLogo from '../assets/images/applogo.jpg';
import Axios from 'axios';
import { Link } from 'react-router-dom';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux stuff
import { connect } from 'react-redux';
import { logoutUser, signupUser } from '../redux/actions/userActions';

const styles =(theme)=> ({
  ...theme.styles
});

class signup extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
      handle: '',
      errors: {}
    };
  }

  // Set local component errors from the global errors in state
  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleSubmit = (event) => {
    // default behaviour is redirecting to /login?email=dsd&password=
    // for form submission. Since we dont want to show email/password in the url
    // we need to prevent this behaviour.
    event.preventDefault();

    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      handle: this.state.handle
    };
    console.log("SIGN UP");
    this.props.signupUser(newUserData, this.props.history);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  };

  render() {
    const { classes, UI:{loading} } = this.props;
    const { errors} = this.state; // Destructuring

    return (
      <>
        <Grid container className={classes.form}>
          <Grid item sm></Grid>
          <Grid item sm>
            <img src={AppLogo} alt="App logo" className={classes.logo} />
            <Typography variant="h2" className={classes.pageTitle}>Sign Up</Typography>
            <form noValidate onSubmit={this.handleSubmit}>
              <TextField
                type="text"
                id="email"
                name="email"
                label="Email"
                className={classes.textField}
                helperText={errors.email}
                error={errors.email? true: false}
                value={this.state.email}
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  className: classes.input,
              }}
              />
              <TextField
                type="password"
                id="password"
                name="password"
                label="Password"
                className={classes.textField}
                helperText={errors.password}
                error={errors.password ? true: false}
                value={this.state.password}
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  className: classes.input,
              }}
              />
              <TextField
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                className={classes.textField}
                helperText={errors.confirmPassword}
                error={errors.confirmPassword? true: false}
                value={this.state.confirmPassword}
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  className: classes.input,
              }}
              />
              <TextField
                type="text"
                id="handle"
                name="handle"
                label="User Handle"
                className={classes.textField}
                helperText={errors.handle}
                error={errors.handle ? true: false}
                value={this.state.handle}
                onChange={this.handleChange}
                fullWidth
                InputProps={{
                  className: classes.input,
              }}
              />
              {errors.general && (<>
                <Typography className={classes.customError}>
                  {errors.general}
                </Typography>
              </>)}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
                disabled={loading}
              >
                SIGN UP
                {loading && <CircularProgress size={20} className={classes.loading}/> }
              </Button>
              <br/>
              <small>Already have an account ? Login <Link to="/login">here</Link></small>
            </form>
          </Grid>
          <Grid item sm></Grid>
        </Grid>
      </>
    )
  }
}

// Adding prop types as well
signup.propTypes = {
  classes: propTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user,
  UI: state.UI
});

const mapActionsToProps = {
  logoutUser,
  signupUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(signup));