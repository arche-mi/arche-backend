import React, { useEffect } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";


function Home() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    const photoUrl = user.photoURL;


    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/landing");
    });

    return (
        <div>
            <a href="/users"><img src={photoUrl} alt="user"/></a>
            <p>Home</p>        
            <p>Ya tout ici normalement</p>
        </div>
    )
}

export default Home;