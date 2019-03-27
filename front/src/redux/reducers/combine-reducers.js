import { combineReducers } from 'redux';
import usersReducers from './userReducers';
import roomsReducers from './roomsReducers';



export default combineReducers({
    users: usersReducers,
    rooms: roomsReducers
})