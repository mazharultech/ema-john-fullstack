import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';

export const initializeLoginFramework = () => {
    if(firebase.apps.length === 0){
        firebase.initializeApp(firebaseConfig);
    }
}

export const handleGoogleSignIn = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(googleProvider)
    .then(res =>{
      const {email, displayName, photoURL} = res.user;
      const signInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
        success: true
      }
      return signInUser;
    })
    .catch(err => {
      console.log(err);
      console.log(err.code);
    })
  }

  export const handleFbSignIn = () => {
    const fbProvider = new firebase.auth.FacebookAuthProvider();
    return firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      var user = result.user;
      user.success = true;
      return user;
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      console.log(errorCode, errorMessage, email, credential);
    });
  }

  export const handleSignOut = () =>{
    return firebase.auth().signOut()
    .then(res => {
      const signOutUser ={
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error: '',
        success: false,
      }
      return signOutUser;
    })
    .catch(err =>{

    })
  }

  export const createUserWithEmailAndPassword = (name, email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      
    .then(res =>{
      const newUserInfo = res.user;
      newUserInfo.error = '';
      newUserInfo.success = true;
      updateUserName(name);
      return newUserInfo;
    })
    .catch(error=> {
      var errorMessage = error.message;
      const newUserInfo = {};
      newUserInfo.success = false;
      newUserInfo.error = errorMessage;
      return newUserInfo;
    });
  }

  export const signInWithEmailAndPassword = (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then(res => {
      const newUserInfo = res.user;
      newUserInfo.error = '';
      newUserInfo.success = true;
      return newUserInfo;
    })
    .catch(function(error) {
      var errorMessage = error.message;
      const newUserInfo = {};
      newUserInfo.success = false;
      newUserInfo.error = errorMessage;
      return newUserInfo;
    });
  }

  export const updateUserName = name =>{
    const user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
    })
    .then(function() {
      console.log("User name updated successfully");
    })
    .catch(error=>{
      console.log(error);
    });
  }