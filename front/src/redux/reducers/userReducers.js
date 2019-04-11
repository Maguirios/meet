import { SET_USER, SET_LOGIN } from "../constants"

const initialState = {
  userName: '',
  userLogin: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, { userName: action.userName });
    case SET_LOGIN:
      return Object.assign({}, state, { userLogin: action.user });
    default:
      return state;
  }
}
