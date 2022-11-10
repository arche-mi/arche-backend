import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";
import "./dashboard.css";
import { async } from "@firebase/util";


function Dashboard() {
    let isUser = true;
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [lastSeen, setLastSeen]= useState();
    const [creationTime, setCreationTime] = useState();
    const [name, setName] = useState()
    const [message, setMessage] = useState();
    const [photo, setPhoto] = useState();    
    const [university, setUniversity] = useState();
    const [filiere, setFiliere] = useState();
    const [level, setLevel] = useState();
    const [sexe, setSexe] = useState();


    let hrefName = null;
    let userid = null;
    try {
        userid = window.location.href.split('#')[1];
        hrefName = window.location.href.split('?')[1].split('#')[0].split('%20').join(' ');
    } catch (err) {
        console.log(err);
    }
    
    // Fetch user Questions
    const fetchUserQuestions = async () => {
        let questions = null;
        try {
            const q = query(collection(db, "users"), where("uid", "==", userid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            //await sleep(1000);
            
            if (!data.questions) {
                questions = {};
            } else {
                questions = data.questions;
            }

        } catch (error) {
            console.log(error);
        }
        let list = document.getElementById("qs");
        if (list.textContent != "") { list.textContent = "" };

        for (let i = 0; i <= Object.keys(questions).pop(); i++) {
            let ul = document.createElement("ul");

            // Pour les questions d'Id non incremente
            if (!questions[i]) i++;

            let li = document.createElement("li");
            li.innerText = Object.values(questions[i][0])[0];
            ul.appendChild(li);

            li = document.createElement("li");
            li.innerText = Object.values(questions[i][1])[0];  
            ul.appendChild(li);
            
            li = document.createElement("li");
            li.innerText = Object.values(questions[i][2])[0];               
            ul.appendChild(li);
            
            li = document.createElement("li");
            li.innerText = (Object.values(questions[i][3].responses)).length + " reponses";
            ul.appendChild(li);


            let a = document.createElement("a");
            let linkText = document.createTextNode("voir plus");
            a.appendChild(linkText);
            ul.appendChild(a);
            // a.title = "more";
            a.href = `/question?${+i}!${userid}#${user?.uid}`;

            list.appendChild(ul);
        }

    }

    // Fetch username by uid
    const fetchUserInfo = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", userid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();

            setName(data.name);            
            setCreationTime(data.creationTime.split(',')[1].split('GMT'));
            setLastSeen(data.lastSeenTime.split(',')[1].split('GMT'));
            setPhoto(data.userPhoto);
            setMessage(data.message);
            setUniversity(data.university);
            setFiliere(data.filiere);
            setLevel(data.level);
            setSexe(data.sexe);
        } catch (err) {
            //console.error(err);
        }
    }; 


    const updateUserProfile = async () => {
        const nun = document.querySelector('#university').textContent;
        const nfl = document.querySelector('#filiere').textContent;
        const nlv = document.querySelector('#level').textContent;
        const nsx = document.querySelector('#sexe').textContent;
        if (nun === university && nfl === filiere && nlv === level && nsx === sexe) {
            alert('aucun modification aporte');
            return false;
        } else {
            setUniversity(nun);
            setFiliere(nfl);
            setLevel(nlv);
            setSexe(nsx);
            try {
                const userDocByUsername = doc(db, "users", name);
                await updateDoc(userDocByUsername, {
                    university: nun,
                    filiere: nfl,
                    level: nlv,
                    sexe: nsx,
                });
            } catch (err) {
                console.error(err);
                // alert(err.message);
            }
        }
        window.location.reload();
    }


    function switchToFeedback() {
        window.location = `/feedback?${user.displayName}`
    }
    
    
    useEffect(() => {
        if (loading) return;
        if (!user) { return navigate("/sign") };
        if (!hrefName) return navigate("/sign");

        fetchUserInfo();            
        fetchUserQuestions();
    }, [user, loading]);
      
    console.log(userid+':'+user?.uid)
    if (userid != user?.uid) {
        return (
            <div>
                <h1>Bio</h1>
                <a href="/">Arch</a><br></br>
                <img src={photo} alt="Photo"/>
                <p>{name}</p>
                <h1>Info</h1>
                <h3>universite : </h3><p id="university">{university}</p>
                <h3>filiere : </h3><p id="filiere">{filiere}</p>
                <h3>niveau : </h3><p id="level">{level}</p>
                <h3>Genre : </h3><p id="sexe">{sexe}</p>
                <p>Derniere connexion : {lastSeen}</p>
                <p>Inscrit le : {creationTime}</p>

                <h1>les question's de {name}</h1>
                <div id="qs"></div>
                
            </div>
        )    
    } else {
        return (
            <div>
                <h1>Bio</h1>
                <a href="/">Arch</a><br></br>
                <img src={photo} alt="Photo"/>
                <p>{name}</p>
                <h1>Info</h1>               
                <h3>universite : </h3><p id="university" contenteditable="true">{university}</p>
                <h3>filiere : </h3><p id="filiere" contenteditable="true">{filiere}</p>
                <h3>niveau : </h3><p id="level" contenteditable="true">{level}</p>
                <h3>Genre : </h3><p id="sexe" contenteditable="true">{sexe}</p>
                <h3>Derniere connexion : {lastSeen}</h3>
                <h3>Inscrit le : {creationTime}</h3>                
                <button onClick={updateUserProfile}>Enregistrer les modification</button>

                <h1>Mes Question's</h1>
                <div id="qs"></div>
    
                <h2>Message</h2>
                <p>{message}</p>
                <button onClick={switchToFeedback}>feedback (nous laisser un message)</button>
            </div>
        )
    }

    
}

export default Dashboard;