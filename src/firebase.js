import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const app = firebase.initializeApp({
  apiKey: "AIzaSyCTiakV32yCWqkCHazqWjCiyi1w9PyjMrs",
  authDomain: "auth-6c6e1.firebaseapp.com",
  databaseURL: "https://auth-6c6e1-default-rtdb.firebaseio.com",
  projectId: "auth-6c6e1",
  storageBucket: "auth-6c6e1.appspot.com",
  messagingSenderId: "97040695297",
  appId: "1:97040695297:web:407e9e64575493bf8e8000"
})

export const auth = app.auth()
export default app
