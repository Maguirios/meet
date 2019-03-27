/* eslint-disable no-underscore-dangle */
import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducers/combine-reducers';

const devtool = window.__REDUX_DEVTOOLS_EXTENSION__COMPOSE__ || compose;

export default createStore(reducer,
  devtool(applyMiddleware(createLogger(), thunkMiddleware)));
