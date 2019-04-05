import { SET_USER } from "../constants";


export const setUser = function setUser(userName){
  return{
    type: SET_USER,
    userName
  }
};
