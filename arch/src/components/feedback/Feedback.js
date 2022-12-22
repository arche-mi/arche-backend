import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces,activeNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";

import Header from "../header/Header";
import Footer from "../footer/Footer";


function Feedback() {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [name, setName] = useState();
    const hrefName = window.location.href.split('?')[1];


    const fetchUserName = async () => {
        try {        
          const q = query(collection(db, "users"), where("uid", "==", user?.uid));
          const doc = await getDocs(q);
          const data = doc.docs[0].data();
        
          setName(data.name);
        } catch (err) {
          console.error(err);
        }
    };     


    const sendFeedback = async () => {
        const feed = document.querySelector("#feed").value;
        if (feed === '') { alert("remplir le champ"); return false }

        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doct = await getDocs(q);
        const data = doct.docs[0].data();

        let currentFeedback = data.feedback;
        currentFeedback.push(feed);

        console.log(currentFeedback);

        const userDocByUsername = doc(db, "users", name);
        activeNetworkAcces();
        await updateDoc(userDocByUsername, {
            feedback: currentFeedback
        });
        alert("Merci pour votre reponse !!!");
        stopNetworkAcces();
        window.location.reload()
    };

    const seeFeedback = async () => {
        alert("Section en meintenance !!!");
    };


    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/sign");

        if (!hrefName) return navigate("/sign");
        if (user.displayName != hrefName) { return navigate("/sign") };

        fetchUserName();

        setTimeout(() => { 
            stopNetworkAcces();
        }, 1000);
       
    }, [user, loading]);

    
    return (
        <>
            <Header />

            <h2>Bienvenue {name}</h2>
            <p>Feedback</p>
            <label>
                <textarea id="feed"></textarea>
            </label><br></br>
            <button onClick={sendFeedback}>Envoyer</button>

            <br></br>

            <button onClick={seeFeedback}>Voir mes Feedback</button>

            <Footer />
        </>
    )
}

export default Feedback;