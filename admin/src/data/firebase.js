import firebase from "firebase";
import "firebase/firestore";
var firebaseConfig = {
  apiKey: "AIzaSyAUbEG1L49COARLWsivHYPc1lmTU5hIxd4",
  authDomain: "cattle-stray.firebaseapp.com",
  databaseURL: "https://cattle-stray.firebaseio.com",
  projectId: "cattle-stray",
  storageBucket: "cattle-stray.appspot.com",
  messagingSenderId: "1080865857229",
  appId: "1:1080865857229:web:64194fe1d2e95da5ca5384",
  measurementId: "G-9NQ6FMZYQ7",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;
