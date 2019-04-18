import { CALL_TIME } from '../constants'

const initialState = {
  callTime: '',

}

export default (state = initialState, { type, payload }) => {
  switch (type) {

  case CALL_TIME:
    return { ...state, callTime: payload }

  default:
    return state
  }
}
