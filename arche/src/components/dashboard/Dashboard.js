import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces,activeNetworkAcces, logout } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";
import "./dashboard.css";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import LoadingSpinner from "../loadSpinner/LoadingSpinner";
import { async } from "@firebase/util";

function Dashboard() {
    const [isLoading, setIsLoading] = useState(false);
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
    const [userData, setData] = useState();
  
    let hrefName = null;
    let userid = null;
    try {
        userid = window.location.href.split('#')[1];
        hrefName = window.location.href.split('?')[1].split('#')[0].split('%20').join(' ');
    } catch (err) {
        console.log(err);
    }


    function corMonth(m) {
        let finalMonth = null;
        const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        month.forEach((i) => {
            if (m == month.indexOf(i)) {
                finalMonth = i;
            }
        })
        return finalMonth
    }

    const firebaseTimeToDayMonthYearAndHourMinutes = async (time) => {
        const questionTime = time.getHours()+':'+time.getMinutes();
        const questionDate = time.getDate()+' '+corMonth(time.getMonth())+', '+time.getFullYear();
        return questionDate+' a '+questionTime;
    }

    const showBadge = async (badge) => {
        console.log(badge);
    }


    const fetchBadges = async () => {
        try {          
            setIsLoading(true);  
            const q = query(collection(db, "badges"));
            const doct = await getDocs(q);
            const data = doct.docs;

            const quser = query(collection(db, "users"), where("uid", "==", userid));
            const doctuser = await getDocs(quser);
            const datauser = doctuser.docs[0].data();
            let userBadges = datauser.badges;    
            let currentUserBadges = [];
            userBadges.forEach(ub => {
                currentUserBadges.push(ub.split('&')[0])
            })

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
            
            let ul = document.createElement("ul");
            allBadges.forEach(badge => {
                if (currentUserBadges.includes(badge[3])) {
                    let div = document.createElement("div");
                    div.classList.add('is');

                    let file = document.createElement("img");
                    file.classList.add('img');
                    file.src = badge[1];
                    file.onclick = function() {showBadge(badge)};
                    div.appendChild(file);

                    ul.appendChild(div);

                }
            })
            badges_area.appendChild(ul);
            
        } catch (error) {
            console.log(error)            
        }
        stopNetworkAcces();
        setIsLoading(false);
    } 

    

    // Fetch user Questions
    const fetchUserQuestions = async () => {
        let questions = null;
        try {
            setIsLoading(true);
            const q = query(collection(db, "users"), where("uid", "==", userid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();        
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

        let count = parseInt(Object.keys(questions).at(-1));

        for (let i = 0; i <= count; i++) {
            let ul = document.createElement("ul");
            
            // Pour les questions d'Id non incremente
            if (questions[i]) {            
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

                li = document.createElement("li");
                const fetchTime = questions[i][4].toDate();
                const date = firebaseTimeToDayMonthYearAndHourMinutes(fetchTime);
                date.then((value) => {
                    li.innerText = "posee le: " + value;
                    ul.appendChild(li);
                });

                let a = document.createElement("a");
                let linkText = document.createTextNode("voir");
                a.appendChild(linkText);
                ul.appendChild(a);
                // a.title = "more";
                a.href = `/question?${+i}!${userid}#${user?.uid}`;

                list.appendChild(ul);
            };
        }
        setIsLoading(false);
    };


    // Fetch user responses
    const fetchUserResponses = async () => {
        try {
            setIsLoading(true);
            const q = query(collection(db, "users"), where("uid", "==", userid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            const responses = data.responses;

            const resp_resp = document.querySelector("#rs");
            if (resp_resp.textContent != "") { resp_resp.textContent = "" };
   
            console.log(responses);
            let count_for_responses = parseInt(Object.keys(responses).at(-1));

            for (let i = 0; i <= count_for_responses; i++) {
                let ul = document.createElement("ul");
                
                // Pour les questions d'Id non incremente
                if (responses[i]) {        
                    let li = document.createElement("li");

                    let a = document.createElement("a");
                    let linkText = document.createTextNode(`${responses[i][0].text}`);
                    a.appendChild(linkText);
                    ul.appendChild(a);
                    // a.title = "more";
                    a.href = `/question?${+responses[i][5]}!${responses[i][1].user}#${user?.uid}`;
                                
                    li = document.createElement("li");
                    const fetchTime = responses[i][3].toDate();
                    const date = firebaseTimeToDayMonthYearAndHourMinutes(fetchTime);
                    date.then((value) => {
                        li.innerText = "posee le: " + value;
                        ul.appendChild(li);
                    });                   

                    resp_resp.appendChild(ul);
                };
            };
            
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };

    // Fetch username by uid
    const fetchUserInfo = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", userid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setData(data);

            setName(data.name);            
            setCreationTime(data.creationTime.split(',')[1].split('GMT'));
            setLastSeen(data.lastSeenTime.split(',')[1].split('GMT'));
            let userPhotoFetch = 0;
            userPhotoFetch = data.userPhoto;            
            setPhoto(userPhotoFetch);
            setMessage(data.message);
            setUniversity(data.university);
            setFiliere(data.filiere);
            setLevel(data.level);
            setSexe(data.sexe);
        } catch (err) {
            console.error(err);
        }
        stopNetworkAcces();
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
                activeNetworkAcces();
                const userDocByUsername = doc(db, "users", name);
                await updateDoc(userDocByUsername, {
                    university: nun,
                    filiere: nfl,
                    level: nlv,
                    sexe: nsx,
                });
            } catch (err) {
                console.error(err);               
            }
        }
        fetchUserInfo();
        stopNetworkAcces();
    }


    function switchToFeedback() {
        window.location = `/feedback?${user.displayName}`
    }
    
    
    useEffect(() => {
        if (loading) return;
        if (!user) { return navigate("/sign") };
        if (!hrefName) return navigate("/sign");

        fetchUserQuestions();
        fetchUserResponses();
        fetchUserInfo();     
        fetchBadges();       
        // setTimeout(() => { 
        //     stopNetworkAcces();
        // }, 1000);
        
    }, [user, loading]);
      
    console.log(userid+':'+user?.uid)
    if (userid != user?.uid) {
        return (
            <>
                <Header />

                <h1>Bio</h1>
                <a href="/">Arch</a><br></br>
                <img referrerpolicy="no-referrer" src={photo} alt="Photo"/>
                <p>{name}</p>
                <h1>Info</h1>
                <h3>universite : </h3><p id="university">{university}</p>
                <h3>filiere : </h3><p id="filiere">{filiere}</p>
                <h3>niveau : </h3><p id="level">{level}</p>
                <h3>Genre : </h3><p id="sexe">{sexe}</p>
                <p>Derniere connexion : {lastSeen}</p>
                <p>Inscrit le : {creationTime}</p>

                <h1>Badges de {name}</h1>
                {isLoading ? <LoadingSpinner /> : fetchBadges}
                <div id="badges_area"></div>

                <h1>les question's de {name}</h1>
                {isLoading ? <LoadingSpinner /> : fetchUserQuestions}
                <div id="qs"></div>

                <h1>les reponses de {name}</h1>
                {isLoading ? <LoadingSpinner /> : fetchUserResponses}
                <div id="rs"></div>

                <Footer />                
            </>
        )    
    } else {
        return (
            <>
                <Header />

                <h1>Bio</h1>
                <img referrerpolicy="no-referrer"  src={photo} alt="Photo"/>
                <p>{name}</p>
                <h1>Info</h1>               
                <h3>universite : </h3><p id="university" contenteditable="true">{university}</p>
                <h3>filiere : </h3><p id="filiere" contenteditable="true">{filiere}</p>
                <h3>niveau : </h3><p id="level" contenteditable="true">{level}</p>
                <h3>Genre : </h3><p id="sexe" contenteditable="true">{sexe}</p>
                <h3>Derniere connexion : {lastSeen}</h3>
                <h3>Inscrit le : {creationTime}</h3>                
                <button onClick={updateUserProfile}>Enregistrer les modification</button>

                <h1>Badges</h1>
                {isLoading ? <LoadingSpinner /> : fetchBadges}
                <div id="badges_area"></div>                

                <h1>Mes Question's</h1>
                {isLoading ? <LoadingSpinner /> : fetchUserQuestions}
                <div id="qs"></div>

                <h1>Mes reponses</h1>
                {isLoading ? <LoadingSpinner /> : fetchUserResponses}
                <div id="rs"></div>
    
                <h2>Message</h2>
                <p>{message}</p>
                <button onClick={switchToFeedback}>feedback (nous laisser un message)</button>
                <button onClick={logout}>Se deconnecter</button>

                <Footer />
            </>
        )
    }

    
}

export default Dashboard;