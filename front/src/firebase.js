import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';



var config = {
  apiKey: "AIzaSyASrUdVkBjdYKp7qYD1aA2ZCiP-iTIOSF8",
  authDomain: "meet-e7c7d.firebaseapp.com",
  databaseURL: "https://meet-e7c7d.firebaseio.com",
  projectId: "meet-e7c7d",
  storageBucket: "meet-e7c7d.appspot.com",
  messagingSenderId: "773067057568"
};
firebase.initializeApp(config);

firebase.firestore()

export default firebase;
