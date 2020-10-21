import React, { useContext, useState } from 'react';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';

firebase.initializeApp(firebaseConfig);

function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    newUser: false,
    name: '',
    password: '',
    email: '',
    photo: ''
  })

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);

  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
    .then(res =>{
      const {email, displayName, photoURL} = res.user;
      const signInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signInUser);
      console.log(email, displayName, photoURL);
    })
    .catch(err => {
      console.log(err);
      console.log(err.code);
    })
  }

  const handleFbSignIn = () => {
    firebase.auth().signInWithPopup(fbProvider).then(function(result) {
      var user = result.user;
      console.log('Facebook user signed in', user)
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
  }

  const handleSignOut = () =>{
    firebase.auth().signOut()
    .then(res => {
      const signOutUser ={
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
        error: '',
        success: false,
      }
      setUser(signOutUser);
      console.log(res);
    })
    .catch(err =>{

    })
  }

  const hanldeBlur = (e) => {
    let isFormValid = true;
    if(e.target.name === 'email'){
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPasswordValid = e.target.value.length > 6;
      const isPaswordHasNumber =  /\d{1}/.test(e.target.value);
      isFormValid = isPasswordValid && isPaswordHasNumber;
    }
    if (isFormValid) {
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      console.log('submitting');
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      
      .then(res =>{
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        updateUserName(user.name);
      })
      .catch(error=> {
        var errorMessage = error.message;
        const newUserInfo = {...user};
        newUserInfo.success = false;
        newUserInfo.error = errorMessage;
        setUser(newUserInfo);
      });
    }
    if (!newUser && user.email && user.password) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        const newUserInfo = {...user};
        newUserInfo.error = '';
        newUserInfo.success = true;
        setUser(newUserInfo);
        setLoggedInUser(newUserInfo);
        history.replace(from);
        console.log("signed in user", res.user)
      })
      .catch(function(error) {
        var errorMessage = error.message;
        const newUserInfo = {...user};
        newUserInfo.success = false;
        newUserInfo.error = errorMessage;
        setUser(newUserInfo);
      });
    }
    e.preventDefault();
  }

  const updateUserName = name =>{
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

  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>sign Out</button>:
        <button onClick={handleSignIn}>sign in</button>
      }

      <br/>
      <button onClick={handleFbSignIn}>sign in using Facebook</button>

      {
        user.isSignedIn && <div>
          <p>Welcome,{user.name}</p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }
      <h1>Our own Authentication</h1>
      <input type="checkbox" name="newUser" onChange={() => setNewUser(!newUser)} id=""/>
      <label htmlFor="newUser">New User Sign up</label>
      <form onSubmit={handleSubmit}>
        {newUser && <input type="text" name="name" onBlur={hanldeBlur} placeholder="Your name"/>}
        <br/>
        <input type="text" name="email" onBlur={hanldeBlur} placeholder="Write Your Email Address" required/>
        <br/>
        <input type="password" onBlur={hanldeBlur} name="password" placeholder="Your password" required/>
        <br/>
        <input type="submit" value={newUser ? 'sign up': 'sign in'}/>
      </form>
    <p style={{color: 'red'}}>{user.error}</p>
    {user.success && <p style={{color: 'blue'}}>User {newUser ?"Created" :"logged In" } Successfully</p>}
    </div>
  );
}

export default Login;
