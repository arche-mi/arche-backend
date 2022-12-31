import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs } from "firebase/firestore";

import Header from "../header/Header";
import Footer from "../footer/Footer";


function Questions() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [photo, setPhoto] = useState();
    const [name, setName] = useState("");


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
        
        let questions_count = 0;
        questions.forEach((item) => {
            
            for (const prop in item[0]) {
                questions_count++;

                let ul = document.createElement("ul");

                let img = document.createElement("img")
                try {
                    img.src = item[3];
                } catch (error) {
                    img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJFfdPAfeJKYiwglp2z9IjDwphJAqEgyAsUv9nfcDLPVXRPzL2B0pLAvUoyVf4QTzoyso&usqp=CAU";                    
                }
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
        });

        let questions_count_text = document.getElementById("questions_count");
        if (questions_count_text.textContent != "") { questions_count_text.textContent = "" };
        let questions_count_p = document.createElement("p");
        questions_count_p.innerText = questions_count + " questions";
        questions_count_text.appendChild(questions_count_p)

        stopNetworkAcces();
    }


    // Fetch username by uid
    const fetchUserInfo = async () => {
        try {
            setName(user.displayName);
            setPhoto(user.photoURL);
        } catch (err) {
            console.error(err);
        }
    }; 
    


    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/landing");

        fetchUserInfo();
        fetchUsersQuestions();

    }, [user, loading]);

    return (
        <>
            <Header />

            <h1>All questions</h1>

            <a href="/question/new">Poser une question ici</a>
            <h3>Tout les questions</h3>
            <p id="questions_count"></p>
            <p id="qs"></p>

            <Footer />
        </>
    )
}

export default Questions;