import { SET_USER } from "../constants"

const initialState = {
LogUser:{}
}

export default (state = initialState,  action) => {
  switch (action.type) {
  case SET_USER:
    return Object.assign({},state,{LogUser:action.user})

  default:
    return state
  }
}
