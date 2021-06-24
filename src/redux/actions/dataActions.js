import {
  SET_SCREAMS, LIKE_SCREAM,
  UNLIKE_SCREAM, DELETE_SCREAM,
  LOADING_DATA, LOADING_UI,
  SET_ERRORS, CLEAR_ERRORS,
  POST_SCREAM, STOP_LOADING_UI,
  SET_SCREAM,
  SUBMIT_COMMENT
} from './keys';
import Axios from 'axios';

// Get all screams
export const getScreams = () => dispatch => {
  dispatch({ type: LOADING_DATA });
  Axios.get(`${process.env.REACT_APP_API_URL}/screams`)
    .then(res => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: SET_SCREAMS,
        payload: []
      })
    })
}

// Post a scream
export const postScream = (newScream) => dispatch => {
  dispatch({ type: LOADING_UI });
  Axios.post(`${process.env.REACT_APP_API_URL}/scream`, newScream)
    .then(res => {
      dispatch({
        type: POST_SCREAM,
        payload: res.data
      });
      dispatch({ type: CLEAR_ERRORS });
    })
    .catch(err => {
      console.log("ERR", err.response.data);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    })
}

// Like a scream
export const likeScream = (screamId) => dispatch => {
  Axios.get(`${process.env.REACT_APP_API_URL}/scream/${screamId}/like`)
    .then(res => {
      console.log("LIKEEEEEEEEE", res.data);
      dispatch({
        type: LIKE_SCREAM,
        payload: res.data
      })
    })
    .catch(err => console.log(err));
}

// Unlike a scream
export const unlikeScream = (screamId) => dispatch => {
  Axios.get(`${process.env.REACT_APP_API_URL}/scream/${screamId}/unlike`)
    .then(res => {
      console.log("UNLIKEEEEEEEEE", res.data);
      dispatch({
        type: UNLIKE_SCREAM,
        payload: res.data
      })
    })
    .catch(err => console.log(err));
}

// Delete a scream
export const deleteScream = (screamId) => dispatch => {
  console.log("Delete screamId", screamId);
  Axios.delete(`${process.env.REACT_APP_API_URL}/scream/${screamId}`)
    .then(() => {
      dispatch({
        type: DELETE_SCREAM,
        payload: screamId
      })
    })
    .catch(err => console.log(err));
}

// Clean the errors stored in state
export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};


// Get individual scream
export const getScream = (screamId) => dispatch => {
  dispatch({ type: LOADING_UI });
  Axios.get(`${process.env.REACT_APP_API_URL}/scream/${screamId}`)
    .then(res => {
      dispatch({
        type: SET_SCREAM,
        payload: res.data
      })
      dispatch({ type: STOP_LOADING_UI })
    })
    .catch(err => console.log(err));
};

// Add comment on a scream
export const submitComment = (screamId, commentData) => dispatch => {

  Axios.post(`${process.env.REACT_APP_API_URL}/scream/${screamId}`, commentData)
    .then(res => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch(err => {
      console.log("EEERRRR", err.response);
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
}

export const getUserHandleProfile = (userHandle) => dispatch => {
  dispatch({ type: LOADING_DATA });
  Axios.get(`${process.env.REACT_APP_API_URL}/user/${userHandle}`)
    .then(res => {
      dispatch({
        type: SET_SCREAMS,
        payload: res.data.screams
      })
    })
    .catch(err => {
      dispatch({
        type: SET_SCREAMS,
        payload: null
      })
    });
}