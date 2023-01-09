import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, stopNetworkAcces } from "../../firebase";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./landing.css";

import hero from "../../assets/images/undraw_Engineering_team_a7n2.png";


function Home() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();


    function switchTosign() {
        window.location.href = "/top/question";
    }

    useEffect(() => {
        if (loading) return;

        setTimeout(() => { 
            stopNetworkAcces();
        }, 1000);

    });

    return (
        <>
            <Header />
            <main className="landing-main">
                <div id="landing-content">
                    <h1>Find answers for your questions</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <button onClick={switchTosign} class="btn-primary" type="button">commencer</button>
                </div>
                <div id="landing-svg">
                    <img src={hero} alt="Hero"/>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default Home;