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
// import { async } from "@firebase/util"

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

            // let badges_area = document.querySelector("#badges_area");
            // badges_area.innerHTML = "";
                        
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
            // badges_area.appendChild(ul);
            
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
        list.innerHTML = "";

        let count = parseInt(Object.keys(questions).at(-1));

        for (let i = 0; i <= count; i++) {
            // let ul = document.createElement("ul");
            
            // Pour les questions d'Id non incremente
            if (questions[i]) {         

                let question1 = document.createElement('div');
                question1.classList.add('question1-dash');
                let rep = document.createElement('div');
                rep.classList.add('reponses-dash');
                let name_rep = document.createElement('div');
                name_rep.classList.add('name-response');
                let h3 = document.createElement('div');
                h3.classList.add('h3');
                let re = document.createElement('div');
                re.classList.add('reponse-dash');
                let txt = document.createElement('div');
                txt.classList.add('texte-dash');
                let btn = document.createElement('div');
                btn.classList.add('bouton-dash');
                
                h3.innerText = Object.values(questions[i][0])[0];              
                
                let p = document.createElement("p");
                const fetchTime = questions[i][4].toDate();
                const date = firebaseTimeToDayMonthYearAndHourMinutes(fetchTime);
                date.then((value) => {
                    p.innerText = value;
                    txt.appendChild(p);
                });

                // for tag
                // li = document.createElement("li");
                // li.innerText = Object.values(questions[i][2])[0];               
                // ul.appendChild(li);
                
                txt.innerHTML = Object.values(questions[i][1])[0];
                re.innerText = (Object.values(questions[i][3].responses)).length + " reponses";
                name_rep.appendChild(h3);
                name_rep.appendChild(re);

                rep.appendChild(name_rep);
                rep.appendChild(txt);

                let a = document.createElement("a");
                let linkText = document.createTextNode("voir");
                a.appendChild(linkText);
                // a.title = "more";
                a.href = `/question?${+i}!${userid}`;
                btn.appendChild(a);
                
                question1.appendChild(rep);
                question1.appendChild(btn);

                list.appendChild(question1);
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
            resp_resp.innerHTML = "";
   
            console.log(responses);
            let count_for_responses = parseInt(Object.keys(responses).at(-1));

            for (let i = 0; i <= count_for_responses; i++) {
                let rr = document.createElement("div");
                rr.classList.add('question1-dash')
                
                // Pour les questions d'Id non incremente
                if (responses[i]) {        
                    let lr = document.createElement("div");
                    lr.classList.add('h3')

                    let a = document.createElement("a");
                    let linkText = document.createTextNode(`${responses[i][0].text}`);
                    a.appendChild(linkText);
                    lr.appendChild(a);
                    // a.title = "more";
                    a.href = `/question?${+responses[i][5]}!${responses[i][1].user}`;
                                
                    let lrd = document.createElement("div");
                    lrd.classList.add('resp-date');
                    const fetchTime = responses[i][3].toDate();
                    const date = firebaseTimeToDayMonthYearAndHourMinutes(fetchTime);
                    date.then((value) => {
                        lrd.innerText = value;
                    });                 
                    rr.appendChild(lr);
                    rr.appendChild(lrd);

                    resp_resp.appendChild(rr);
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
            alert('Mise a jour du profile effectuee !!!');
        }
        fetchUserInfo();
        // stopNetworkAcces();
    }


    function switchToFeedback() {
        window.location = `/feedback?${user.displayName}`
    }
    
    
    useEffect(() => {
        setIsLoading(true);
        
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
                {isLoading ? <LoadingSpinner /> : fetchBadges}
                <Header />           

                <div id="conteneurprincipale-dash">
                    <div class="rectangle-dash">
                        <div class="user-detail">
                            <div class="image-dash">
                                <img referrerpolicy="no-referrer" src={photo} alt="Photo"/>
                            </div>
                            <div class="infos-dash">
                                <h3>{name}</h3>
                                <p>Inscrit le : {creationTime}</p>
                                <p>Derniere connexion : {lastSeen}</p>
                            </div>
                        </div>   
                        <div class="user-detail-editable">
                            <p id="university">{university}</p>
                            <p id="filiere">{filiere}</p>
                            <p id="level">{level}</p>
                            <p id="sexe">{sexe}</p>
                        </div>    
                        {/* <div className="badge" id="badges_area"></div> */}
                    </div>
                    <div class="questions-dash">
                        <div class="question-dash">
                            <div class="h3">
                                <h2>Les questions de {name}</h2>
                                <div id="qs"></div>
                            </div>                                           
                            <div class="Reponse-dash">
                                <h2>Les reponses de {name}</h2>
                                <div id="rs"></div>
                            </div>
                        </div>
                    </div>                   
                </div>        

                <Footer />                
            </>
        )    
    } else {
        return (
            <>
                {isLoading ? <LoadingSpinner /> : fetchBadges}
                <Header />

                <div id="conteneurprincipale-dash">
                    <div class="rectangle-dash">
                        <div class="user-detail">
                            <div class="image-dash">
                                <img referrerpolicy="no-referrer" src={photo} alt="Photo"/>
                            </div>
                            <div class="infos-dash">
                                <h3>{name}</h3>
                                <p>Inscrit le : {creationTime}</p>
                                <p>Derniere connexion : {lastSeen}</p>
                            </div>
                        </div>   
                        <div class="user-detail-editable">
                            <p contenteditable="true" id="university">{university}</p>
                            <p contenteditable="true" id="filiere">{filiere}</p>
                            <p contenteditable="true" id="level">{level}</p>
                            <p contenteditable="true" id="sexe">{sexe}</p>
                            <button onClick={updateUserProfile} className="update-profile" type="button">Enrégistrer les Modifications</button>
                        </div>    
                        <div class="user-cta">
                            <h3>Message</h3>
                            <p>{message}</p>
                            <div className="btn-dash">
                                <button onClick={switchToFeedback}>feedback (nous laisser un message)</button>
                                <button onClick={logout}>Se deconnecter</button>
                            </div>
                        </div>                
                        {/* <div className="badge" id="badges_area"></div> */}
                    </div>
                    <div class="questions-dash">
                        <div class="question-dash">
                            <div class="h3">
                                <h2>Mes questions</h2>                          
                                <div id="qs"></div>
                            </div>                                           
                            <div class="Reponse-dash">
                                <h2>Mes reponses</h2>
                                <div id="rs"></div>
                            </div>
                        </div>
                    </div>                   
                </div>                                             

                <Footer />
            </>
        )
    }

    
}

export default Dashboard;