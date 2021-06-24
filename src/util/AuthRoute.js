import React from 'react'
import { Route, Redirect } from 'react-router';
import { connect } from 'react-redux';
import propTypes from 'prop-types';

/**
 * Custom Component to check user authentication before re-directing to any page.
 *
 * @param {*} param0
 * @returns
 */
const AuthRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      authenticated === true ? <Redirect to="/" /> : <Component {...props} />
    }
  />
)

AuthRoute.propTypes = {
  authenticated: propTypes.bool.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(AuthRoute);