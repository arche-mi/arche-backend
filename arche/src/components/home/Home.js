import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, doc } from "firebase/firestore";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import LoadingSpinner from "../loadSpinner/LoadingSpinner";


function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");
    const [userid, setUid] = useState("");



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


    // Fetch users Questions
    const fetchUsersQuestions = async () => {
        let questions = [];
        try {
            setIsLoading(true);
            const q = query(collection(db, "users"));
            const doc = await getDocs(q);
            const data = doc.docs;
            data.forEach((item) => {
                if (!item.data().questions) {
                    item.data().questions = {};
                }
                const tempQuestions = [item.data().questions, item.data().name, item.data().uid, item.data().userPhoto]
                questions.push(tempQuestions);
            })       
        } catch (error) {
            console.log(error);
        }
        
        let list = document.getElementById("qs");
        if (list.textContent != "") { list.textContent = "" };

        questions.forEach((item) => {
            
            for (const prop in item[0]) {

                if ((Object.values(item[0][prop][3].responses)).length >= 2) {
                    let ul = document.createElement("ul");

                    let img = document.createElement("img")
                    img.setAttribute('referrerpolicy', 'no-referrer');
                    img.src = item[3];                  
                    ul.appendChild(img);

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
                    li.innerText = (Object.values(item[0][prop][3].responses)).length + " reponses";
                    ul.appendChild(li);


                    let a = document.createElement("a");
                    let linkText = document.createTextNode("voir");
                    a.appendChild(linkText);
                    ul.appendChild(a);
                    // a.title = "more";
                    a.href = `/question?${+prop}!${item[2]}#${user?.uid}`;

                    const fetchTime = questions[questions.indexOf(item)][0][0][4].toDate();
                    const date = firebaseTimeToDayMonthYearAndHourMinutes(fetchTime);
                    li = document.createElement("li");
                    date.then((value) => {
                        li.innerText = "posee le: " + value;
                        ul.appendChild(li); 
                    });
                    
                    list.appendChild(ul);
                }                
            }
        })
        setIsLoading(false);
        setTimeout(() => { 
            stopNetworkAcces();
        }, 1000);
    }


    // Fetch username by uid
    const fetchUserInfo = async () => {
        try {
            setUid(user.uid)
            setName(user.displayName);
            setPhoto(user.photoURL);
        } catch (err) {
            console.error(err);
        }
    }; 

    function switchToProfile() {
        window.location = `/user?${name}#${user?.uid}`;
    }
    function switchToUsers() {
        window.location = `/users`;
    }    
    function switchToQuestions() {
        window.location.href = `/questions`;
    }
    function switchToUnanswered() {
        window.location.href = `/unanswered`;
    }
    function switchToTopQuestions() {
        window.location.href = `/`;
    }  
    function switchToTopLibrairie() {
        window.location.href = `/librairie#${name}`
    }
            

    useEffect(() => {
        if (loading) return;        

        if (!user) navigate("/landing");

        fetchUserInfo();
        fetchUsersQuestions();        

    }, [user, loading]);

    return (
        <>
            <Header />
            <button onClick={switchToProfile}>vers ton profil {name}</button>

            <button onClick={switchToTopLibrairie}>librairie</button><br></br>
            <button onClick={switchToTopQuestions}>top questions</button><br></br>
            <button onClick={switchToQuestions}>tous les questions</button><br></br>
            <button onClick={switchToUnanswered}>tous les questions non repondu</button><br></br>
            <button onClick={switchToUsers}>tous les utilisateurs</button><br></br>
            <p>Home ,Ya tout ici normalement</p>

            <h2>Question's</h2>
            <a href="/question/new">Poser une question ici</a>
            <h3>Top questions</h3>
            <p id="qs"></p>            
            {isLoading ? <LoadingSpinner /> : fetchUsersQuestions}

            <Footer />
        </>
    )
}

export default Home;
