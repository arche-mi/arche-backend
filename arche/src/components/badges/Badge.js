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

            const quser = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doctuser = await getDocs(quser);
            const datauser = doctuser.docs[0].data();
            let userBadges = datauser.badges;    

            let badges_area = document.querySelector("#badges_area");
            if (badges_area.hasChildNodes != "") { badges_area.textContent = "" };
                        
            // Fetch all badges by type
            function fetcher(data, arr, type) {
                data.forEach(item => {
                    if (item.data().type == type) {
                        arr.push([item.data().type, item.data().ref, item.data().description, item.data().title])
                    }
                });                
            };
            let allBadges = [];
            fetcher(data, allBadges, 'commune');
            fetcher(data, allBadges, 'rare');
            fetcher(data, allBadges, 'legendaire');
            console.log(allBadges);
            console.log(userBadges);
            
            let ul = document.createElement("ul");
            allBadges.forEach(badge => {
                if (userBadges.includes(badge[3])) {
                    let file = document.createElement("img");
                    file.classList.add('img_is');
                    file.src = badge[1];
                    ul.appendChild(file);  
                } else {
                    let file = document.createElement("img");
                    file.classList.add('img_is_not');
                    file.src = badge[1];
                    ul.appendChild(file);  
                }
            })
            badges_area.appendChild(ul);


            
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