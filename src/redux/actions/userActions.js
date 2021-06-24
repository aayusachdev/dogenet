import { SET_USER, SET_ERRORS, CLEAR_ERRORS, LOADING_USER, LOADING_UI, SET_UNAUTHENTICATED } from './keys';
import Axios from 'axios';

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });

  Axios.post(`${process.env.REACT_APP_API_URL}/login`, userData)
    .then(res => {
      console.log(res.data); // data returned by API is in res.data when using Axios
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      // To redirect the user back to homepage once signed in
      // React Router provides us with a history object, which is
      // accessible by passing this object into each route as a prop.
      // This history object lets us manually control the history of the browser.
      history.push('/');
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      })
    });
};


export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  Axios.get(`${process.env.REACT_APP_API_URL}/user`)
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
    });
};



export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });

  Axios.post(`${process.env.REACT_APP_API_URL}/signup`, newUserData)
    .then(res => {
      console.log(res.data); // data returned by API is in res.data when using Axios
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      // To redirect the user back to homepage once signed in
      // React Router provides us with a history object, which is
      // accessible by passing this object into each route as a prop.
      // This history object lets us manually control the history of the browser.
      history.push('/');
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      })
    });
};


export const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);

  // Each time we send a request using Axios it will have this in headers by default.
  Axios.defaults.headers.common['Authorization'] = FBIdToken;
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIdToken');
  delete Axios.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const uploadImage = (formData) => (dispatch) => {
  dispatch({ type: LOADING_USER });
  Axios.post(`${process.env.REACT_APP_API_URL}/user/uploadimage`, formData)
    .then(res => {
      dispatch(getUserData());
    }).catch(err => {
      console.log(err);
    })
};

export const editUserDetails = (userData) => dispatch => {
  console.log("dsdsd", userData);
  dispatch({ type: LOADING_USER });
  Axios.post(`${process.env.REACT_APP_API_URL}/user`, userData)
    .then(res => {
      dispatch(getUserData());
    })
    .catch(err => {
      console.log(err);
    })
};