import { combineReducers } from 'redux';
import usersReducers from './userReducers';
import roomsReducers from './roomsReducers';
import { firebaseReducer } from 'react-redux-firebase';


export default combineReducers({
    users: usersReducers,
    rooms: roomsReducers,
    firebase: firebaseReducer
})