import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';


const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)
  const [birthday, setBirthday] = useState()
  const [quotes, setQuotes] = useState();
  const [quote, setQuote] = useState(); 

  async function getQuotes() {
    const quotes = await (await fetch("https://type.fit/api/quotes")).json();
    setQuotes(quotes);
    const totalQuotes = quotes.length;
    const index = Math.floor(Math.random() * totalQuotes);
    const quote = quotes[index];
    setQuote(quote);
  }

  function writeUserData(userId, name, email, birthdate) {
    const userInfo = {
      birthdate: birthdate,
      email: email,
      name: name,
      userId: userId,
    };
    firebase.database().ref('users/' + userId).set(userInfo);
    setBirthday(userInfo);
    // renderUserInfo(userInfo);
  }

  function signup(email, name, birthdate, password) {
    return auth.createUserWithEmailAndPassword(email, password)
    .then(function(res){
      if(res){
        writeUserData(res.user.uid, name, email, birthdate);
      }
    })
    .catch(function(error){
      console.log('Error signup,',error.message)
      alert(error.message)
   })
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password)
  }

  function readOnceWithGet(userId) {
    const dbRef = firebase.database().ref();
    dbRef.child("users").child(userId).get().then((snapshot) => {
      if (snapshot.exists()) {
        const userInfo = snapshot.val();
        //{birthdate, email, name}
        // renderUserInfo(userInfo);
        setBirthday(userInfo);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
      if (user) {
        readOnceWithGet(user.uid)
        getQuotes();
      }
    })
    return unsubscribe
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
    birthday,
    quotes,
    quote,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
