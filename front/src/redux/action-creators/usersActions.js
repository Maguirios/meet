import { SET_USER } from "../constants";
import axios from "axios";

const getUser = user => ({
  type: SET_USER,
  user
});

export const fetchUser = email => dispatch =>
  axios.get(`/api/signup`, email).then(user => dispatch(getUser(user)));
