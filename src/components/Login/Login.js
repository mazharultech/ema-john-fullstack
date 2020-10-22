import React, { useContext, useState } from 'react';
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router-dom';
import { createUserWithEmailAndPassword, handleFbSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './LoginManger';

function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    newUser: false,
    name: '',
    password: '',
    email: '',
    photo: ''
  })

  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);

  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
    handleGoogleSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }

  const fbSignIn = () => {
    handleFbSignIn()
    .then(res => {
      handleResponse(res, true);
    })
  }

  const signOut = () => {
    handleSignOut()
    .then(res => {
      handleResponse(res, false);
    })
  }

  const handleResponse = (res, redirects) =>{
        setUser(res);
        setLoggedInUser(res);
        if(redirects){
          history.replace(from);
        }
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
      createUserWithEmailAndPassword(user.name ,user.email, user.password)
      .then(res =>{
        handleResponse(res, true);
      })
    }
    if (!newUser && user.email && user.password) {
      signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        handleResponse(res, true);
      })
    }
    e.preventDefault();
  }

  

  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={signOut}>sign Out</button>:
        <button onClick={googleSignIn}>sign in</button>
      }

      <br/>
      <button onClick={fbSignIn}>sign in using Facebook</button>

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
