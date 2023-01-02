import React, { useEffect, useState } from "react";
import { activeNetworkAcces, auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, getDoc, updateDoc} from "firebase/firestore";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import LoadingSpinner from "../loadSpinner/LoadingSpinner";
import { async } from "@firebase/util";
import './badges.css'

function Badges() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [allBadges, setAllBadges] = useState();

    let username = null;
    try {
        username = window.location.href.split('#')[1].split('%20').join(' ');
    } catch (err) {
        console.log(err);
    }


    const fetchBadges = async () => {
        try {          
            setIsLoading(true);  
            const q = query(collection(db, "badges"));
            const doct = await getDocs(q);
            const data = doct.docs;
            setAllBadges(data);      

            const quser = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doctuser = await getDocs(quser);
            const datauser = doctuser.docs[0].data();
            let currentBadge = datauser.badges;    
            console.log(currentBadge);

            let badges_area = document.querySelector("#badges_area");
            if (badges_area.hasChildNodes != "") { badges_area.textContent = "" };
                        

            data.forEach(item => {
                console.log(item.data());
            });
            
        } catch (error) {
            console.log(error)            
        }
        stopNetworkAcces();
        setIsLoading(false);
    } 


    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/landing");
        if (!username) navigate("/");

        fetchBadges();
        
    }, [user, loading]);


    return (
        <>

        <Header/ >

        <div>
            Badges ici

            {isLoading ? <LoadingSpinner /> : fetchBadges}
            <div id="badges_area"></div>
        </div>

        <Footer/ >

        </>
    )
}

export default Badges;