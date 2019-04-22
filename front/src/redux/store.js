/* eslint-disable no-underscore-dangle */
import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import reducer from './reducers/combine-reducers';
import { getFirestore } from 'redux-firestore';
import { getFirebase } from 'react-redux-firebase';


export default createStore(reducer,
  compose(
    applyMiddleware(createLogger(), thunkMiddleware.withExtraArgument({ getFirebase, getFirestore })),
  )
);
