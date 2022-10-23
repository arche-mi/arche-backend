import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";



function Dashboard() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [lastSeen, setLastSeen]= useState();
    const [creationTime, setCreationTime] = useState();
    const [photo, setPhoto] = useState();    
    const [questions, setQuestions] = useState();
    
    // Fetch user Questions
    const fetchUserQuestions = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            //await sleep(1000);
            
            if (!data.questions) {
                const questions = {};                
                data.questions = questions;
            }
            setQuestions(data.questions);
            console.log(questions)

        } catch (error) {
            console.log(error);
        }
    }

    // Fetch username by uid
    const fetchUserInfo = async () => {
        try {
            setName(user.displayName);
            setCreationTime(user.metadata.creationTime.split(',')[1].split('GMT'));
            setLastSeen(user.metadata.lastSignInTime.split(',')[1].split('GMT'));
            setPhoto(user.photoURL);
            // console.log(user);
        } catch (err) {
            //console.error(err);
        }
    }; 
    
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/sign");
            
        fetchUserInfo();
        fetchUserQuestions();
    }, [user, loading]);
      

    return (
        <div>
            <h1>Bio</h1>
            <a href="/">Arch</a><br></br>
            <img src={photo} alt="Photo"/>
            <p>{name}</p>
            <p>Derniere connexion : {lastSeen}</p>
            <p>Inscrit le : {creationTime}</p>

            <h1>Question's</h1>
            // display with foreach fn
        </div>
    )
}

export default Dashboard;