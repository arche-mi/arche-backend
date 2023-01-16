import React, { useEffect, useState } from "react";
import { db,auth } from "../../firebase";
import { query, onSnapshot, collection, getDocs, setIndexConfiguration } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import './home_aside.css';

function HomeAside() {
    const [infos, setInfos] = useState([]);
    const [user, loading] = useAuthState(auth);

        
    useEffect(() => {    
        if (loading) return;

        const q = query(collection(db, 'infos'));
        const docmt = onSnapshot(q, (querySnapshot) => {
          let infos = [];
          querySnapshot.forEach((doc) => {
            infos.push({ text: doc.data().text, votes: doc.data().votes });
          });
          setInfos(infos.reverse());
        });
        return () => docmt();
            
    }, [user, loading]);
    

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
            </div>      

        </>
    )
}

export default HomeAside;