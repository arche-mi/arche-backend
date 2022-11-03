import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";


// Convert millisecond to Day:Hours:Minutes thanks Stackoverflow & @Mic
function dhm(t){
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? '0' + n : n; };
  if( m === 60 ){
    h++;
    m = 0;
  }
  if( h === 24 ){
    d++;
    h = 0;
  }
  return [d, pad(h), pad(m)].join(':');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

function firebaseTimeToDayMonthYearAndHourMinutes(time) {
    const questionTime = time.getHours()+':'+time.getMinutes();
    const questionDate = time.getDate()+' '+corMonth(time.getMonth())+', '+time.getFullYear();
    return questionDate+' a '+questionTime;
}


function ReadQuestion() {
    const [name, setName] = useState();
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();    
    const [title, setTitle] = useState();
    const [text, setText] = useState();
    const [tags, setTags] = useState();
    const [date, setDate] = useState();
    const [responses, setResponses] = useState();

    const questionId = window.location.href.split('?')[1].split('#')[0];
    const userid = window.location.href.split('#')[1];
    console.log(questionId+' : '+userid);

    const fetchUserName = async () => {
        try {        
          const q = query(collection(db, "users"), where("uid", "==", userid));
          const doc = await getDocs(q);
          const data = doc.docs[0].data();
        
          setName(data.name);
        } catch (err) {
          console.error(err);
        }
    }; 

    const fetchUserQuestions = async () => {
        let questions = null;        
        try {
            const q = query(collection(db, "users"), where("uid", "==", userid));
            const doct = await getDocs(q);
            const data = doct.docs[0].data();
            //await sleep(1000);
            
            if (!data.questions) {
                questions = {};
            } else {
                questions = data.questions
            }
            setTitle(Object.values(questions[questionId][0])[0]);
            setText(Object.values(questions[questionId][1])[0]);

            const tagsp = document.querySelector("#tags");
            for (let i=0; i < Object.values(questions[questionId][2])[0].length; i++) {
                let ul = document.createElement("ul");
                let li = document.createElement("li");
                li.innerText = Object.values(questions[questionId][2])[0][i];
                ul.appendChild(li);
                tagsp.appendChild(ul);
            }

            //setResponses(Object.values(questions[questionId][3]));

            const currentTime = Date.now();
            const fetchTime = questions[questionId][4].toDate();           
            console.log(firebaseTimeToDayMonthYearAndHourMinutes(fetchTime));
            setDate(firebaseTimeToDayMonthYearAndHourMinutes(fetchTime));

        } catch (error) {
            console.log(error);

            //alert('tu nes pas a ta place ...');
            //window.location = `/`
        }
    }
    

    const deletQuestion = async () => {
        console.log(questionId);
        let questions = {};        
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doct = await getDocs(q);
            const data = doct.docs[0].data();
            //await sleep(1000);
            
            if (!data.questions) {
                questions = {};
            } else {
                questions = data.questions
            }

            let updQuestions = {};
            for (let i = 0; i < Object.values(questions).length; i++) {
                if (Object.keys(questions)[i] != questionId) {
                    updQuestions[Object.keys(questions)[i]] = Object.values(questions)[i]
                }
            }
            console.log(updQuestions);
            const userDocByUsername = doc(db, "users", name);
            await updateDoc(userDocByUsername, {
                questions: updQuestions
            });
            window.location = `/user?${name}`;

        } catch (error) {
            console.log(error);
        }
    }

    function switchToProfile() {
        window.location = `/user?${name}`;
    }

    useEffect(() => {
        if (loading) return;
        //if (!user) return navigate("/sign");
        if (!questionId) return navigate("/sign");
        
        fetchUserName();
        fetchUserQuestions();
    }, [user, loading]);


    return (
        <div>
            <button onClick={switchToProfile}>mon profile</button>
            <h3>Question</h3>
            <p>titre : {title}</p>
            <p>text : {text}</p>
            <p id="tags">tags: </p>
            <p>publier le : {date}</p>
            <p>reponses : {responses}</p>
            <button onClick={deletQuestion}>supprimer</button>
        </div>
    )
}

export default ReadQuestion;