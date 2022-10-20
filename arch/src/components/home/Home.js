import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";


function Home() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");


    // Fetch username by uid
    const fetchUserInfo = async () => {
        try {
            setName(user.displayName);
            setPhoto(user.photoURL);
            //console.log(user);
        } catch (err) {
            //console.error(err);
        }
    }; 


    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/landing");

        fetchUserInfo();
    }, [user, loading]);

    return (
        <div>
            <a href="/users">va vers ton profil : {name}</a>
            <p>Home</p>        
            <p>Ya tout ici normalement</p>
        </div>
    )
}

export default Home;