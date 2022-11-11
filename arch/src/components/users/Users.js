import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, doc } from "firebase/firestore";
import { async } from "@firebase/util";


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
                usernamelink.href = `/user?${item.data().uid}#${user.uid}`;

                let li = document.createElement("li");                
                li.innerText = item.data().university;
                ul.appendChild(li);

                li = document.createElement("li");                
                li.innerText = item.data().filiere;
                ul.appendChild(li);

                li = document.createElement("li");                
                li.innerText = parseInt(Object.keys(item.data().questions).pop())+1 + " questions";
                ul.appendChild(li);
                           
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
    }, [user, loading]);


    return (
        <div>
            <a href="/">Arch</a><br></br>
            <h1>Tous les users</h1>
            <div id="users"></div>
        </div>
    )
}

export default Users;