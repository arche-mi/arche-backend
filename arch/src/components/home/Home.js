import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, doc } from "firebase/firestore";



function Home() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");


    // Fetch users Questions
    const fetchUsersQuestions = async () => {
        let questions = [];
        try {
            const q = query(collection(db, "users"));
            const doc = await getDocs(q);
            const data = doc.docs;
            data.forEach((item) => {
                if (!item.data().questions) {
                    item.data().questions = {};
                }
                const tempQuestions = [item.data().questions, item.data().name, item.data().uid]
                questions.push(tempQuestions);
            })
            //await sleep(1000);
                        
        } catch (error) {
            console.log(error);
        }
        
        let list = document.getElementById("qs");
        if (list.textContent != "") { list.textContent = "" };

        questions.forEach((item) => {
            
            for (const prop in item[0]) {

                let ul = document.createElement("ul");

                let usernamelink = document.createElement("a");
                let usernamelinktext = document.createTextNode(item[1]);                
                usernamelink.appendChild(usernamelinktext);
                ul.appendChild(usernamelink);
                // a.title = "more";
                usernamelink.href = `/user?${item[1]}#${item[2]}`;

                let li = document.createElement("li");                
                li.innerText = Object.values(item[0][prop][0]);
                ul.appendChild(li);

                li = document.createElement("li");
                li.innerText = Object.values(item[0][prop][1]);
                ul.appendChild(li);
                
                li = document.createElement("li");
                li.innerText = Object.values(item[0][prop][2])
                ul.appendChild(li);
                
                li = document.createElement("li");
                li.innerText = Object.keys(Object.values(item[0][prop][3])).pop() + " reponses";
                ul.appendChild(li);


                let a = document.createElement("a");
                let linkText = document.createTextNode("voir plus");
                a.appendChild(linkText);
                ul.appendChild(a);
                // a.title = "more";
                a.href = `/question?${+prop}!${item[2]}#${user?.uid}`;

                list.appendChild(ul);
            }
        })

    }

    // Fetch username by uid
    const fetchUserInfo = async () => {
        try {
            setName(user.displayName);
            setPhoto(user.photoURL);
            //console.log(user);
        } catch (err) {
            //console.error(err);
        }
    }; 

    function switchToProfile() {
        window.location = `/user?${name}#${user?.uid}`;
    }

    function switchToDonation() {
        window.location.href = `/donation?${user.displayName}`;
    }


    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/landing");

        fetchUserInfo();
        fetchUsersQuestions();
    }, [user, loading]);

    return (
        <div>
            <h1>Header</h1>
            <button onClick={switchToProfile}>vers ton profil {name}</button>
            <p>Home ,Ya tout ici normalement</p>

            <h2>Question's</h2>
            <a href="/question/new">Poser une question ici</a>
            <h3>Tout les questions</h3>
            <p id="qs"></p>

            <h1><button onClick={switchToDonation}>Faire un don !</button></h1>
        </div>
    )
}

export default Home;