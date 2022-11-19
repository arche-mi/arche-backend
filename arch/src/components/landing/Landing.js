import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";


function Home() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();


    useEffect(() => {
        if (loading) return;
        if (user) navigate("/");
    });

    return (
        <div>
            <p>Bienvenu sur le forum</p>
            <a href="/sign">commencer</a><br></br>
        </div>
    )
}

export default Home;