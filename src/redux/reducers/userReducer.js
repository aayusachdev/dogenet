import {
  SET_USER,
  SET_AUTHENTICATED,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  LIKE_SCREAM,
  UNLIKE_SCREAM
} from '../actions/keys';

const initialState = {
  authenticated: false,
  credentails: {},
  liked: [],
  loading: false,
  notifications: []
};

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, action)=>{
  switch (action.type) {

    case SET_AUTHENTICATED:
      return { ...state, authenticated: true };

    case SET_UNAUTHENTICATED:
      return initialState;

    case SET_USER:
      return {
        authenticated: true,
        loading: false,
        ...action.payload
      };

    case LOADING_USER:
      return { ...state, loading: true };
    case LIKE_SCREAM:
      return {
        ...state,
        likes: [
          ...state.likes,
          {
            userHandle: state.credentails.userHandle,
            screamId: action.payload.screamId
          }
        ]
      }
      case UNLIKE_SCREAM:
        return {
          ...state,
          likes: [
            ...state.likes.filter(like=> like.screamId !== action.payload.screamId )
          ]
        }
    default:
      return state;
  }
};