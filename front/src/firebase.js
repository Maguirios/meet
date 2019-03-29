import firebase from 'firebase'

import 'firebase/auth'

var config = {
  apiKey: "AIzaSyDvzmSN1D73gtVHrMzFWgjWTbLh__NTS3s",
  authDomain: "meet-2824a.firebaseapp.com",
  databaseURL: "https://meet-2824a.firebaseio.com",
  projectId: "meet-2824a",
  storageBucket: "meet-2824a.appspot.com",
  messagingSenderId: "1014077530882"
};
firebase.initializeApp(config);

firebase.firestore().settings({ timestampsInSnapshots: true })

export default firebase;
