import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import propTypes from 'prop-types';
import AppLogo from '../assets/images/applogo.jpg';
import { Link } from 'react-router-dom';

// MUI stuff
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

// Redux stuff
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';


const styles = (theme) => ({
 ...theme.styles
});

class login extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {}
    };
  }

  // static getDerivedStateFromProps(nextProps) {
  //   if (nextProps.UI.errors) {
  //     this.setState({ errors: nextProps.UI.errors });
  //   }
  // }

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
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData, this.props.history);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  };

  render() {
    const { classes, UI:{ loading } } = this.props;
    const { errors } = this.state; // Destructuring

    return (
      <>
        <Grid container className={classes.form}>
          <Grid item sm></Grid>
          <Grid item sm>
            <img src={AppLogo} alt="App logo" className={classes.logo} />
            <Typography variant="h2" className={classes.pageTitle}>LogIn to Dogebook</Typography>
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
                disabled={""}
              >
                LOGIN
                {loading && <CircularProgress size={20} className={classes.loading}/> }
              </Button>
              <br/>
              <small>Don't have an account ? sign up <Link to="/signup">here</Link></small>
            </form>
          </Grid>
          <Grid item sm></Grid>
        </Grid>
      </>
    )
  }
}

// Adding prop types as well
login.propTypes = {
  classes: propTypes.object.isRequired,
  loginUser: propTypes.func.isRequired,
  user: propTypes.object.isRequired,
  UI: propTypes.object.isRequired
}

// Takes our global state and takes what this component needs
const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI
})

// We are telling which actions we are going to use in this component
const mapActionsToProps = {
  loginUser
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(login));