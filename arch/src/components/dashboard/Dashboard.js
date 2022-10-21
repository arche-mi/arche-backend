import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [lastSeen, setLastSeen]= useState();
    const [creationTime, setCreationTime] = useState();
    const [photo, setPhoto] = useState();    
    
    // Fetch user Questions
    

    // Fetch username by uid
    const fetchUserInfo = async () => {
        try {
            setName(user.displayName);
            setCreationTime(user.metadata.creationTime.split(',')[1].split('GMT'));
            setLastSeen(user.metadata.lastSignInTime.split(',')[1].split('GMT'));
            setPhoto(user.photoURL);
            //console.log(user);
        } catch (err) {
            //console.error(err);
        }
    }; 
    
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/sign");
            
        fetchUserInfo();
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
        </div>
    )
}

export default Dashboard;