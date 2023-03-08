import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { query, collection, getDocs, where, doc } from "firebase/firestore";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import LoadingSpinner from "../loadSpinner/LoadingSpinner";
import './home.css';
import HomeAside from "./home_aside";
import StickyHeader from "../header/stickyHeader";


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

    function switchToQuestion(prop, item) {
        window.location.href = `/question?${+prop}!${item}`;
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
                    image.appendChild(usernamelink);

                    let nb_rs = document.createElement("span");
                    nb_rs.classList.add('nb_answered');
                    nb_rs.innerText = (Object.values(item[0][prop][3].responses)).length + " reponses";
                    user.appendChild(nb_rs);

                    let titre = document.createElement("span");                
                    titre.classList.add('titre');
                    titre.onclick = function() { switchToQuestion(prop, item[2]) };
                    titre.innerText = Object.values(item[0][prop][1]);

                    // li = document.createElement("li");
                    // li.innerText = Object.values(item[0][prop][0]);
                    // ul.appendChild(li);
                    
                    // li = document.createElement("li");
                    // li.innerText = Object.values(item[0][prop][2])
                    // ul.appendChild(li);    
                    
                    // let voir = document.createElement('span');
                    // voir.classList.add('view');
                    // let a = document.createElement("a");
                    // let linkText = document.createTextNode("voir");
                    // voir.appendChild(linkText);
                    // a.appendChild(voir);
                    // // a.title = "more";
                    // a.href = `/question?${+prop}!${item[2]}`;
                    
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
                    // qs.appendChild(a);
                    qs_home.appendChild(qs);
                    all.appendChild(qs_home);
                }                                
            }
        })
        setIsLoading(false);
        setTimeout(() => { 
            // stopNetworkAcces();
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
            

    useEffect(() => {
        if (loading) return;        

        if (!user) navigate("/");

        fetchUserInfo();
        fetchUsersQuestions();    
    }, [user, loading]);

    return (
        <>
            {isLoading ? <LoadingSpinner /> : fetchUsersQuestions}
            <Header />


            <div class="container-home">
                <StickyHeader />
                <main class="home-main">                                   
                    <div class="entete">
                        <span>Top Questions</span>
                        <span ><a href="/question/new">New</a></span>
                    </div>
                    
                    <div class="allquestion">                              
                    </div>
                </main>
                <section className="aside-home-section">
                    <HomeAside />
                </section>
            </div>            

            <Footer />
        </>
    )
}

export default Home;