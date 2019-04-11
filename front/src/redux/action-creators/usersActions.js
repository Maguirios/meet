import { SET_USER, SET_LOGIN } from "../constants";


export const setUser = function setUser(userName){
  return{
    type: SET_USER,
    userName
  }
};

export const setLogin = function setLogin(user){
  return{
    type: SET_LOGIN,
    user
  }
}
