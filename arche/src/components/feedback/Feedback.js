import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces,activeNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, getDoc, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";
import { isEmpty } from "@firebase/util";

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
        if (feed === '') { alert("Merci de remplir le champ"); return false }

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

        // send to admin also
        try {
            const docRef = doc(db, "admin", "feedback");
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            let newFeedback = data.feedbacks;
            let key = parseInt(Object.keys(newFeedback).at(-1))+1;
            if (isEmpty(newFeedback)) {
                newFeedback = {}
                key = 0;
            }
            console.log(`On a deja ${Object.keys(newFeedback).length} newFeedback`);
            newFeedback[key] = [user?.uid, feed];    
            await updateDoc(docRef, {
                feedbacks: newFeedback
            });
            
        } catch (error) {
            console.log(error);
        }

        alert("Merci pour votre reponse !!!");
        stopNetworkAcces();
        window.location.reload()
    };


    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/sign");

        if (!hrefName) return navigate("/sign");
        // if (user.displayName != hrefName) { return navigate("/sign") };

        fetchUserName();     
       
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

            <Footer />
        </>
    )
}

export default Feedback;