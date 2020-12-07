import firebase from 'firebase'
import "firebase/storage"

const firebaseConfig = {
   apiKey: "AIzaSyA77LE5ZAeCZzVYNSTj4woTCjhgcSmDpDk",
   authDomain: "react-projects-c80d2.firebaseapp.com",
   databaseURL: "https://react-projects-c80d2.firebaseio.com",
   projectId: "react-projects-c80d2",
   storageBucket: "react-projects-c80d2.appspot.com",
   messagingSenderId: "1089756533006",
   appId: "1:1089756533006:web:011bdf9082be1e612c475f",
   measurementId: "G-Q2LX5NQHK6"
};

firebase.initializeApp(firebaseConfig)

export const groupsRef = firebase.storage().ref().child("/messenger/groups")
export const profileRef = firebase.storage().ref("/messenger/profiles")