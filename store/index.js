import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import main from './main';

const exampleInitialState = {
  main: main.initialState,
};

const rootReducer = combineReducers({
  main: main.reducer,
});

export function initializeStore(initialState = exampleInitialState) {
  return createStore(rootReducer, initialState, composeWithDevTools(applyMiddleware(thunkMiddleware)));
}
