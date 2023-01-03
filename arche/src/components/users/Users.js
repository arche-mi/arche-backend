import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs } from "firebase/firestore";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import { async } from "@firebase/util";
<<<<<<< HEAD
=======
import LoadingSpinner from "../loadSpinner/LoadingSpinner";
>>>>>>> main


function sort(items){
  var length = items.length;  
    for (var i = 0; i < length; i++) { 
          for (var j = 0; j < (length - i - 1); j++) { 
            if(items[j][1] < items[j+1][1]) {
                var tmp = items[j]; 
                items[j] = items[j+1]; 
                items[j+1] = tmp; 
            }
        }        
    } 
    return items   
}

function Users() {
<<<<<<< HEAD
=======
    const [isLoading, setIsLoading] = useState(false);
>>>>>>> main
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    
    const fetchUsersByQuestions = async () => {
        try {
<<<<<<< HEAD
=======
            setIsLoading(true); 
>>>>>>> main
            const q = query(collection(db, "users"));
            const doc = await getDocs(q);
            const data = doc.docs;

            let users_div = document.querySelector("#users");
            if (users_div.textContent != "") { users_div.textContent = "" };
            
            let userData = [];

            data.forEach((item) => {
                let qslength = 0;
                try {
                    qslength = parseInt(Object.keys(item.data().questions).pop())+1;
                } catch (error) {
                    qslength = 0;
                }                
                userData.push([item.data().name, qslength])            
            })

            console.log(userData);
<<<<<<< HEAD
            // filtre user data by most index 1 of userData arr witch is questions numbers
=======
            // filtre user data by most index[1] of userData arr witch is questions numbers
>>>>>>> main
            const userDataSorted = sort(userData);
            console.log(userDataSorted);

            for (let i = 0; i < userDataSorted.length; i++) {
                data.forEach((item) => {      
                
                    if (item.data().name == userDataSorted[i][0]) {
                            
                        let ul = document.createElement("ul");

<<<<<<< HEAD
                        let img = document.createElement("img")
                        try {
                            img.src = item.data().userPhoto;                    
                        } catch (error) {
                            img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJFfdPAfeJKYiwglp2z9IjDwphJAqEgyAsUv9nfcDLPVXRPzL2B0pLAvUoyVf4QTzoyso&usqp=CAU";                    
                        }
=======
                        let img = document.createElement("img");
                        img.setAttribute('referrerpolicy', 'no-referrer');
                        img.src = item.data().userPhoto;                               
>>>>>>> main
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
                    }
                })
            }                        
        } catch (error) {
            console.log(error);
        }
<<<<<<< HEAD
=======
        setIsLoading(false);
>>>>>>> main
    }

    const fetchUsers = async () => {
        try {
<<<<<<< HEAD
=======
            setIsLoading(true); 
>>>>>>> main
            const q = query(collection(db, "users"));
            const doc = await getDocs(q);
            const data = doc.docs;

            let users_div = document.querySelector("#users");
            if (users_div.textContent != "") { users_div.textContent = "" };
        

                data.forEach((item) => {                                 
                        let ul = document.createElement("ul");

                        let img = document.createElement("img")
<<<<<<< HEAD
                        try {
                            img.src = item.data().userPhoto;                    
                        } catch (error) {
                            img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJFfdPAfeJKYiwglp2z9IjDwphJAqEgyAsUv9nfcDLPVXRPzL2B0pLAvUoyVf4QTzoyso&usqp=CAU";                    
                        }
=======
                        img.setAttribute('referrerpolicy', 'no-referrer');
                        img.src = item.data().userPhoto;                    
>>>>>>> main
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

            stopNetworkAcces();
<<<<<<< HEAD
                                
=======
            setIsLoading(false);
>>>>>>> main
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
        <>
            <Header />

            <h1>Tous les users</h1>
            <button onClick={fetchUsers}>last users</button>
            <button onClick={fetchUsersByQuestions}>questions</button>
<<<<<<< HEAD
            <div id="users"></div>

=======
            {isLoading ? <LoadingSpinner /> : fetchUsersByQuestions}
            <div id="users"></div>
>>>>>>> main
            <Footer />
        </>
    )
}

export default Users;