import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

function Dashboard() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const creationTime = user.metadata.creationTime.split(',')[1].split('GMT');
    const lastSeen = user.metadata.lastSignInTime.split(',')[1].split('GMT');
    const photoUrl = user.photoURL;
    
    // Fetch username by uid
    const fetchUserName = async () => {
        try {
            setName(user.displayName);
            console.log(user);
        } catch (err) {
            console.error(err);
        }
    }; 
    
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/sign");
            
        fetchUserName();
    });
      

    return (
        <div>
            <img src={photoUrl} alt="user"/>
            <p>{name}</p>
            <p>Derniere connexion : {lastSeen}</p>
            <p>Inscrit le : {creationTime}</p>
        </div>
    )
}

export default Dashboard;