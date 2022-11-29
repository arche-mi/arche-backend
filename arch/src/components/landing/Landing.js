import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";


function Home() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();


    function switchTosign() {
        window.location.href = "/sign";
    }

    useEffect(() => {
        if (loading) return;
        if (user) navigate("/");
    });

    return (
        <>
            <button onClick={switchTosign}>Commencer</button>
        </>
    )
}

export default Home;