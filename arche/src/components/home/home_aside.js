import React, { useEffect, useState } from "react";
import { db,auth } from "../../firebase";
import { getDocs, setIndexConfiguration } from "firebase/firestore";
import { getFirestore, query, collection, onSnapshot, serverTimestamp, where, addDoc, orderBy, doc, setDoc, Firestore } from "firebase/firestore";

import { useAuthState } from "react-firebase-hooks/auth";
import './home_aside.css';

function HomeAside() {
    const [infos, setInfos] = useState([]);
    const [user, loading] = useAuthState(auth);
    const [messages, setMessages] = useState([])

        
    useEffect(() => {    
        if (loading){
            return;   
        }

        const q = query(collection(db, 'infos'));
        const docmt = onSnapshot(q, (querySnapshot) => {
          let infos = [];
          querySnapshot.forEach((doc) => {
            infos.push({ text: doc.data().text, votes: doc.data().votes });
          });
          setInfos(infos.reverse());
        });
        // return () => docmt();


        const qm = query(collection(db, 'messages'), orderBy('timestamp'));
        const unsubscribe = onSnapshot(qm, (querySnapshot) => {
          let messages = [];
          querySnapshot.forEach((doc) => {
            messages.push({ ...doc.data(), id: doc.id });
          });
          setMessages(messages.reverse().slice(0, 4));
        });
        return () => unsubscribe();
            
    }, [user, loading]);
    

    if (!user) {
        window.location = "/sign";
    } else {
        return (
            <>
    
                <div class="home-aside">
                    <h1 class="hello-aside">
                        Hello World!
                    </h1>
                    <p class="home-aside-p">
                        Il s'agit d'un site collaboratif de questions-réponses 
                        et plus destiné aux étudiants en mathématiques et en informatiques. Il est 100% gratuit.
                    </p>
                    <h1 class="home-aside-h1">
                        Flux d'Informations
                    </h1>
                    <div className='info-feed'>
                        {infos.map(({ text, votes }) => (
                            <div className="info-feed-item">
                                {/* <p className="vote">{votes}</p> */}
                                <span>-</span>
                                <li className="li-aside">{text}</li>
                            </div>
                        ))}
                    </div>
                    <h1 class="home-aside-h1">
                        Chat (recent)
                    </h1>
                    <div className="chat-aside info-feed">
                        <div className="msgs-aside">
                            {messages.map(({ id, message, sender, photoURL, uid }) => (
                                <div className="msgs-cta-aside">
                                    <div key={id} className={`msg-aside ${uid === auth.currentUser.uid ? 'sent' : 'received'}`}>
                                        <p>{message}</p>
                                    </div>
                                    <hr className="hr-chat"></hr>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>      
    
            </>
        )
    }

}

export default HomeAside;