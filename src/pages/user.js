import React, { Component } from 'react';
import propTypes from 'prop-types';
import Axios from 'axios';
import Scream from '../components/scream/Scream';
import StaticProfile from '../components/profile/StaticProfile';

// MUI stuff
import Grid from '@material-ui/core/Grid';

// Redux stuff
import { connect } from 'react-redux';
import { getUserHandleProfile } from '../redux/actions/dataActions';


class user extends Component {

  state = {
    profile: null
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;

    this.props.getUserHandleProfile(handle);
    Axios.get(`${process.env.REACT_APP_API_URL}/user/${handle}`)
      .then(res => {
        this.setState({
          profile: res.data.user
        })
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    const { screams, loading } = this.props.data;
    const screamsMarkup = loading ? (
      <p>Loading data...</p>
    ) : screams === null || screams.length === 0 ? (
      <p> No screams from this user</p>
    ) : (
      screams.map(scream => <Scream key={scream.screamId} scream={scream} />)
    );
    return (
      <Grid container spacing={5}>
        <Grid item sm={8} xs={12}>
          <div>
            {screamsMarkup}
          </div>
        </Grid>
        <Grid item sm={4} xs={12}>
          {this.state.profile === null ? <p>Loading profile...</p> :
            <StaticProfile profile={this.state.profile} />}
        </Grid>
      </Grid>

    )
  }
}

user.propTypes = {
  data: propTypes.object.isRequired,
  getUserHandleProfile: propTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.data
});

const mapActionsToProps = {
  getUserHandleProfile
}
export default connect(mapStateToProps, mapActionsToProps)(user);