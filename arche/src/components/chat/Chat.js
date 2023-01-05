import React, { useEffect, useState, useRef } from "react";
import { activeNetworkAcces, auth, db, data, stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, query, getDocs, collection, onSnapshot, serverTimestamp, where, addDoc, orderBy, doc, setDoc, Firestore } from "firebase/firestore";
import "./chat.css";


import Header from "../header/Header";
import Footer from "../footer/Footer";


function Chat() {

    const scroll = useRef();
    const [messages, setMessages] = useState([])

    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [userid, setUid] = useState("");
    const [username, setName] = useState("");
    const [formValue, setFormValue] = useState("");

    const [fileUrl, setUrl] = useState("");
    const [percent, setPercent] = useState(0);
    const [isReady, setIsready] = useState(true);
    


    // Send message function
    const sendMessage = async () => {
        try {
        //get message from form field
        const msg = document.getElementById("message").value;

        //set data to insert in an object
        const insertData = {
            message: msg,
            sender: user.displayName,
            timestamp: serverTimestamp(),
        }        

        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "messages"), insertData);
        var check = console.log("Document written with ID: ", docRef.id);
        
        } catch (err) {
            console.log(err);
        }
        
    }


    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/landing");

        const q = query(collection(db, 'messages'), orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          let messages = [];
          querySnapshot.forEach((doc) => {
            messages.push({ ...doc.data(), id: doc.id });
          });
          setMessages(messages);
        });
        return () => unsubscribe();


    }, [user, loading]);



    return (      
        <>
            <Header />

                <h1>ChatRoom</h1>
                <div id="chat">
                    {/* messages will display here */}
                    <div className="msgs">
                        {messages.map(({ id, message, sender, photoURL, uid }) => (
                            <div>
                                <div key={id} className={`msg ${uid === auth.currentUser.uid ? 'sent' : 'received'}`}>
                                    <li>{sender}:   {message}</li>
                                </div>
                            </div>
                        ))}
                    </div>

                    <br />

                     {/* form to send message  */}
                    {/* <form id="message-form"> */}
                    <input id="message" type="text"/>
                    <button onClick={sendMessage} id="message-btn">Send</button>
                    {/* </form> */}
                </div>

            <Footer />
        </>
    )
}

export default Chat;