import React, { Component } from 'react'
import propTypes from 'prop-types';

// MUI stuff
import Grid from '@material-ui/core/Grid'

// Components
import Scream from '../components/scream/Scream';
import Profile from '../components/profile/Profile';

// Redux stuff
import { connect } from 'react-redux';
import { getScreams } from '../redux/actions/dataActions';

class home extends Component {

  componentDidMount() {
    this.props.getScreams();
  }

  render() {
    const { screams, loading } = this.props.data;

    let recentScreamsMarkup = !loading ? (
      screams.map((scream) => <Scream key={scream.screamId} scream={scream} />)
    ) : <div>Loading...</div>
    return (
      <Grid container spacing={5}>
        <Grid item sm={8} xs={12}>
          <div>
            {recentScreamsMarkup}
          </div>
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    )
  }
};


home.propTypes = {
  data: propTypes.object.isRequired,
  getScreams: propTypes.func.isRequired
}

const mapStateToProps = state => ({
  data: state.data
})

const mapActionsToProps = {
  getScreams
}

export default connect(mapStateToProps, mapActionsToProps)(home);