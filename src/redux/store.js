import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from "redux-logger";
import thunk from "redux-thunk";

import userReducer from './reducers/userReducer';
import dataReducer from './reducers/dataReducer';
import uiReducer from './reducers/uiReducer';

const initialState = {};
const middleware = [thunk, logger];

const reducers = combineReducers({
  user: userReducer,
  UI: uiReducer,
  data: dataReducer
});

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;



// Composes functions from right to left.

// (arguments): The functions to compose. Each function is expected to accept a single parameter.
// Its return value will be provided as an argument to the function standing to the left, and so on.
// The exception is the right - most argument which can accept multiple parameters, as it will provide
// the signature for the resulting composed function.

// (Returns): The final function obtained by composing the given functions from right to left.

// pass 3 things
// const store = compose(
//   applyMiddleware(...middleware),
//   window.devToolsExtension && window.devToolsExtension(),
// )(createStore)(reducers, initialState);
