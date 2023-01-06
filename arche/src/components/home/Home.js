import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, doc } from "firebase/firestore";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import LoadingSpinner from "../loadSpinner/LoadingSpinner";
import './home.css';


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
        
        let all = document.querySelector('.allquestion');
        all.innerHTML = "";
        
        questions.forEach((item) => {
            
            for (const prop in item[0]) {
                
                if ((Object.values(item[0][prop][3].responses)).length >= 2) {
                    let qs_home = document.createElement("div");
                    qs_home.classList.add('question-home')

                    let qs = document.createElement('div');
                    qs.classList.add('blockquestion');

                    let qs_cta = document.createElement('div');
                    qs_cta.classList.add('qs-cta');

                    let user = document.createElement("div");
                    user.classList.add('user');
                    let image = document.createElement("div");
                    image.classList.add('image');

                    let img = document.createElement("img")
                    img.setAttribute('referrerpolicy', 'no-referrer');
                    img.src = item[3];                  
                    image.appendChild(img);
                    user.appendChild(image);

                    let usernamelink = document.createElement("span");
                    usernamelink.classList.add('name_user');
                    let usernamelinktext = document.createTextNode(item[1]);                
                    usernamelink.appendChild(usernamelinktext);
                    // a.title = "more";
                    usernamelink.href = `/user?${item[1]}#${item[2]}`;
                    user.appendChild(usernamelink);

                    let nb_rs = document.createElement("span");
                    nb_rs.classList.add('nb_answered');
                    nb_rs.innerText = (Object.values(item[0][prop][3].responses)).length + " reponses";
                    user.appendChild(nb_rs);

                    let titre = document.createElement("span");                
                    titre.classList.add('titre');
                    titre.innerText = Object.values(item[0][prop][1]);

                    // li = document.createElement("li");
                    // li.innerText = Object.values(item[0][prop][0]);
                    // ul.appendChild(li);
                    
                    // li = document.createElement("li");
                    // li.innerText = Object.values(item[0][prop][2])
                    // ul.appendChild(li);    
                    
                    let voir = document.createElement('span');
                    voir.classList.add('view');
                    let a = document.createElement("a");
                    let linkText = document.createTextNode("voir");
                    voir.appendChild(linkText);
                    a.appendChild(voir);
                    // a.title = "more";
                    a.href = `/question?${+prop}!${item[2]}`;
                    
                    // const fetchTime = questions[questions.indexOf(item)][0][0][4].toDate();
                    // const date = firebaseTimeToDayMonthYearAndHourMinutes(fetchTime);
                    // li = document.createElement("li");
                    // date.then((value) => {
                        //     li.innerText = "posee le: " + value;
                        //     ul.appendChild(li); 
                        // });
                        
                    qs_cta.appendChild(user);
                    qs_cta.appendChild(titre);
                    qs.appendChild(qs_cta);
                    qs.appendChild(a);
                    qs_home.appendChild(qs);
                    all.appendChild(qs_home);
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
        
        const top = document.querySelector('.topq');
        const allq = document.querySelector('.allq');
        const unq = document.querySelector('.unq');
        const usrs = document.querySelector('.usrs');

        const currentPage = window.location.href;
        if (currentPage.includes('user')) {
            usrs.style.background = '#516FD4FC';
        } else if (currentPage.includes('unanswered')) {
            unq.style.background = '#516FD4FC';
        } else if (currentPage.includes('questions')) {
            allq.style.background = '#516FD4FC';
        } else {
            top.style.background = '#516FD4FC';
            console.log(2)
        }

    }, [user, loading]);

    return (
        <>
            {isLoading ? <LoadingSpinner /> : fetchUsersQuestions}
            <Header />

            <div class="container-home">
                <main class="home-main">
                    <div class="header-home">
                        <span onClick={switchToTopQuestions} class="item active topq" data-name="01">Top Questions</span>
                        <span onClick={switchToQuestions} class="item allq" data-name="02">Toutes les questions</span>
                        <span onClick={switchToUnanswered} class="item unq" data-name="03">Questions non repondues</span>
                        <span onClick={switchToUsers} class="item usrs"><a href="#">Utilisateurs</a></span>
                    </div>
                    
                    <div class="entete">
                        <span>Top Questions</span>
                        <span ><a href="/question/new">Poser une question</a></span>
                    </div>
                    
                    <div class="allquestion">                              
                    </div>
                </main>
            </div>            

            <Footer />
        </>
    )
}

export default Home;