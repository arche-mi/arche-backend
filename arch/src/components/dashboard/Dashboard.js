import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { doc, query, collection, getDocs, where } from "firebase/firestore";
import { db, auth } from "../../firebase";

function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const [name, setName] = useState("");

    // Fetch username by uid
    const fetchUserName = async () => {
        try {
            setName(user.displayName);
            console.log("user id :" + user.uid);
        } catch (err) {
            console.error(err);
        }
    }; 

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/sign");
            
        fetchUserName();
    }, [user, loading]);
      

    return (
        <p>Ton profil : {name}</p>
    )
}

export default Dashboard;