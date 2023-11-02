import React, { useEffect } from 'react'

import {useState} from "react"

import { getDatabase , ref, push, set, onChildAdded} from "firebase/database";
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import './App.css';
const firebaseConfig = {
  apiKey: "AIzaSyCSs9zQRadOxRz1YyBOt0elrfiLg2qxpyY",
  authDomain: "react-chat-application-454eb.firebaseapp.com",
  databaseURL: "https://react-chat-application-454eb-default-rtdb.firebaseio.com",
  projectId: "react-chat-application-454eb",
  storageBucket: "react-chat-application-454eb.appspot.com",
  messagingSenderId: "743225331218",
  appId: "1:743225331218:web:bb25ce1f73a74dfbb212cb",
  measurementId: "G-7MX05Z63DF"
};
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();



function App() {
 
  const [user , setUser] = useState('');
  const [chats, setChats] = useState([]);
  const [msg , setMsg] = useState('');
  const db = getDatabase(app);
  const googleLogin = ()=>{
    signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log(user, token);
      setUser({name: result.user.displayName , email: result.user.email});
     
    }).catch((error) => {
    
      const errorCode = error.code;
      console.log(errorCode);
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      
    });
  
  }

  const chatListRef = ref(db, 'chats');
  const updateHeight = () =>{
    const el = document.getElementById('chat');
    if(el)
    {
      el.scrollTop = el.scrollHeight;
    }
  
  };
  useEffect(()=>{
    onChildAdded(chatListRef, (data) => {
      setChats(chats=>[...chats,data.val()]);
      setTimeout(()=>{
        updateHeight();
      },1000);
      
   });
  },[])

  const sendChat = () =>{

    const chatRef = push(chatListRef);
  
    set(chatRef, {
      user,message : msg
    });
    setMsg('');

  }
  return (
    <div>
      { user.email ? null : <div>
        {/* <input type="text" placeholder="Enter name to start " onBlur={(e)=>setUser(e.target.value)}> </input> */}
        <button onClick={(e)=>{googleLogin()}}>SignIn</button>
      </div>
      }
      {user.email ? <div>
      <h3>User : {user.name}</h3>
      <div id= "chat" className="chat-container">
        {chats.map((c,i)=><div key = {i} className={`container  ${c.user.email === user.email ? 'me': ''}`}>
          <p className="chatBox">
           <strong>{c.user.name} :</strong>
           <span>{c.message}</span>
          
          </p>
        </div>)}
      </div>
      <div className="btm">
        <input onInput={e=>setMsg(e.target.value)} type="text" placeholder="Enter you chat " value={msg}></input>
        <button onClick={()=>sendChat()}>
          Send
        </button>
      </div>
      </div> : null}
    </div>
  )
}

export default App
