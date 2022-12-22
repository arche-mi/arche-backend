import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs } from "firebase/firestore";

import Header from "../header/Header";
import Footer from "../footer/Footer";


function Users() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, "users"));
            const doc = await getDocs(q);
            const data = doc.docs;

            let users_div = document.querySelector("#users");
            if (users_div.textContent != "") { users_div.textContent = "" };
            
            data.forEach((item) => {
                let ul = document.createElement("ul");

                let img = document.createElement("img")
                img.src = item.data().userPhoto;
                ul.appendChild(img);

                let usernamelink = document.createElement("a");
                let usernamelinktext = document.createTextNode(item.data().name);                
                usernamelink.appendChild(usernamelinktext);
                ul.appendChild(usernamelink);
                // a.title = "more";
                usernamelink.href = `/user?${item.data().name}#${item.data().uid}`;

                let li = document.createElement("li");                
                li.innerText = item.data().university;
                ul.appendChild(li);

                li = document.createElement("li");                
                li.innerText = item.data().filiere;
                ul.appendChild(li);

                li = document.createElement("li");                
                try {
                    li.innerText = parseInt(Object.keys(item.data().questions).pop())+1 + " questions";
                    ul.appendChild(li);                    
                } catch (error) {
                    console.log(error);
                    li.innerText = 0 + " questions";
                    ul.appendChild(li);                    
                }
                           
                users_div.appendChild(ul);
            })
                        
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/landing");

        fetchUsers();

        setTimeout(() => { 
            stopNetworkAcces();
        }, 1000);    
        
        // const state = loadState("home",0);
        // if (state == true) {
        //     setTimeout(() => { 
        //         stopNetworkAcces();
        //     }, 4000);
        // } else {
        //     stopNetworkAcces();            
        // }


    }, [user, loading]);


    return (
        <>
            <Header />

            <h1>Tous les users</h1>
            <div id="users"></div>

            <Footer />
        </>
    )
}

export default Users;