import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, stopNetworkAcces } from "../../firebase";
import Header from "../header/Header";
import Footer from "../footer/Footer";


function Home() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();


    function switchTosign() {
        window.location.href = "/sign";
    }

    useEffect(() => {
        if (loading) return;
        // if (user) navigate("/");

        setTimeout(() => { 
            stopNetworkAcces();
        }, 1000);

    });

    return (
        <>
            <Header />
            <button onClick={switchTosign}>Commencer</button>
        </>
    )
}

export default Home;