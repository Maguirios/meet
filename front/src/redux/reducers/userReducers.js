import { SET_USER } from "../constants"

const initialState = {
  userName: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return Object.assign({}, state, { userName: action.userName });
    default:
      return state;
  }
}
