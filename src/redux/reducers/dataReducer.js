import {
  SET_SCREAMS, LIKE_SCREAM,
  UNLIKE_SCREAM, DELETE_SCREAM,
  LOADING_DATA, POST_SCREAM,
  SET_SCREAM, SUBMIT_COMMENT
} from '../actions/keys';

const initialState = {
  screams: [],
  scream: {},
  loading: false
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action) => {
  let index;
  switch (action.type) {
    case LOADING_DATA:
      return { ...state, loading: true };
    case SET_SCREAMS:
      return {
        ...state,
        screams: action.payload,
        loading: false
      }
    case LIKE_SCREAM:
    case UNLIKE_SCREAM:
      index = state.screams.findIndex(scream => scream.screamId === action.payload.screamId);
      state.screams[index] = action.payload;
      if (state.scream.screamId === action.payload.screamId) {
        state.scream = action.payload;
      }
      return {
        ...state
      }

    case DELETE_SCREAM:
      index = state.screams.findIndex(scream => scream.screamId === action.payload);
      state.screams.splice(index, 1);
      return { ...state };

    case POST_SCREAM:
      return {
        ...state,
        screams: [
          action.payload,
          ...state.screams
        ]
      }
    case SET_SCREAM:
      return {
        ...state,
        scream: action.payload
      }

    case SUBMIT_COMMENT:
      return {
        ...state,
        scream: {
          ...state.scream,
          comments: [action.payload,
          ...state.scream.comments]
        }
      }

    default:
      return state;
  }
}
