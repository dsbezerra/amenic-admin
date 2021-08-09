import _ from 'lodash';

const initialState = {
  theme: 'light',
};

const SET_THEME = 'app/SET_THEME';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_THEME:
      return _.set({ ...state }, 'theme', action.theme);

    default:
      return state;
  }
};

// ACTIONS
export const setTheme = theme => dispatch => dispatch({ type: SET_THEME, theme });

const main = {
  initialState,
  reducer,
};

export default main;
