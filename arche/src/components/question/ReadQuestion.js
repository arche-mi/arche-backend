import React, { useEffect, useState } from "react";
import { activeNetworkAcces, auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, getDoc, updateDoc} from "firebase/firestore";
import storage from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { isEmpty } from "@firebase/util";

import Header from "../header/Header";
import Footer from "../footer/Footer";


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
    const [questionPhoto, setQuestionPhoto] = useState(); 
    let [responses, setResponses] = useState("");
    
    const [fileUrl, setUrl] = useState("");
    const [percent, setPercent] = useState(0);
    const [isReady, setIsready] = useState(true);

    const questionId = window.location.href.split('?')[1].split('!')[0];
    const userid = window.location.href.split('!')[1].split('#')[0];
    console.log(questionId+' : '+userid);


    const fetchUserName = async () => {
        try {        
          const q = query(collection(db, "users"), where("uid", "==", userid));
          const docs = await getDocs(q);
          const data = docs.docs[0].data();
        
          setName(data.name);
        } catch (err) {
          console.error(err);
        }
    }; 

    const getUserAnswer = async (id) => {
        try {        
            const q = query(collection(db, "users"), where("uid", "==", id));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();

            return data.name;
        } catch (err) {
            console.error(err);
        }
    }


    const fetchUserQuestions = async () => {
        let questions = null;        
        try {
            const q = query(collection(db, "users"), where("uid", "==", userid));
            const doct = await getDocs(q);
            const data = doct.docs[0].data();

            if (!data.questions) {
                questions = {};
            } else {
                questions = data.questions
            }
            setTitle(Object.values(questions[questionId][0])[0]);
            setText(Object.values(questions[questionId][1])[0]);
            setQuestionPhoto(Object.values(questions[questionId][5]).join(''));

            // Fetch users responses
            let emptyRespData = {};
            const userFetchResponses = Object.values(questions[questionId][3])[0];
            console.log(userFetchResponses)
            console.log(Object.keys(userFetchResponses).pop())
            if (isEmpty(userFetchResponses)) {
                setResponses(emptyRespData);
            } else {
                setResponses(userFetchResponses)
            }
            

            //les renders
            const tags_resp = document.querySelector("#tags");
            if (tags_resp.textContent != "") { tags_resp.textContent = "" };
            for (let i=0; i < Object.values(questions[questionId][2])[0].length; i++) {
                let ul = document.createElement("ul");
                let li = document.createElement("li");
                li.innerText = Object.values(questions[questionId][2])[0][i];
                ul.appendChild(li);
                tags_resp.appendChild(ul);
            }      

            //render des reponses
            const resp_resp = document.querySelector("#resp");
            if (resp_resp.textContent != "") { resp_resp.textContent = "" };
            for (let i=0; i <= Object.keys(Object.values(questions[questionId][3])[0]).pop(); i++) {
                const response_date = firebaseTimeToDayMonthYearAndHourMinutes(Object.values(questions[questionId][3])[0][i][3].toDate());
                const fetchUserAnswer = getUserAnswer(Object.values(questions[questionId][3])[0][i][2].user_answer);
                const printAddress = async () => {
                    const userAnswer = await fetchUserAnswer;                                                

                    let ul = document.createElement("ul");
                    let li = document.createElement("li");
                    li.innerText = Object.values(questions[questionId][3])[0][i][0].text;
                    ul.appendChild(li);                                   

                    let aPhoto = document.createElement("a");
                    let img = document.createElement("img")
                    img.src = Object.values(questions[questionId][3])[0][i][4];
                    console.log(Object.values(questions[questionId][3])[0][i][4] + "image ou pas si vide");
                    aPhoto.href = Object.values(questions[questionId][3])[0][i][4];
                    aPhoto.appendChild(img)
                    ul.appendChild(aPhoto);
                    // a.title = "more";

                    li = document.createElement("li");
                    li.innerText = "reponse du: " + response_date;
                    ul.appendChild(li);     

                    let a = document.createElement("a");
                    let linkText = document.createTextNode(userAnswer);
                    a.appendChild(linkText);
                    ul.appendChild(a);
                    // a.title = "more";
                    a.href = `/user?${Object.values(questions[questionId][3])[0][i][2].user_answer}#${user?.uid}`;

                    resp_resp.appendChild(ul);
                };
                printAddress()
            }          

            const currentTime = Date.now();
            const fetchTime = questions[questionId][4].toDate();           
            setDate(firebaseTimeToDayMonthYearAndHourMinutes(fetchTime));

        } catch (error) {
            console.log(error);
        }
        // stopNetworkAcces();
    }
    

    const deleteQuestion = async () => {
        console.log(questionId);
        let questions = {};        
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doct = await getDocs(q);
            const data = doct.docs[0].data();

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
            window.location = `/user?${name}#${user?.uid}`;

        } catch (error) {
            console.log(error);
        }
    }



    const updateResponses = async () => {
        let questions = null;   
        try {            
            // update questions
            const q = query(collection(db, "users"), where("uid", "==", userid));
            const doct = await getDocs(q);
            const data = doct.docs[0].data();
            questions = data.questions;
            questions[questionId][3] = {responses:responses};
            const userDocByUsername = doc(db, "users", name);
            console.log("update start new");
            await updateDoc(userDocByUsername, {
                questions: questions
            });
            const response_text = document.querySelector("#response_text");
            response_text.value = '';

            // update user who ask questions
            const qcu = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doctcu = await getDocs(qcu);
            const datacu = doctcu.docs[0].data();
            console.log(responses)
            const userDocByUsernameCu = doc(db, "users", datacu.name);
            await updateDoc(userDocByUsernameCu, {
                responses: responses
            });
            console.log("update done");
            fetchUserQuestions();
        } catch (error) {
            console.log(error);
        }
    }



    const createNewResponses = async () => {
        console.log(typeof(responses))
        if (responses.length === 0) {
            responses = {}
        }
        if (isReady) {
            try {       
                const response_text = document.querySelector('#response_text').value;
                if (response_text === '') {
                    alert("remplissez le champs reponse svp");
                    return false;
                } else {               
                    const date = new Date();
                    let key = Object.keys(responses).length;
                    if (isEmpty(responses)) {
                        setResponses({});
                        key = 0;
                    }
                    console.log(`On a deja ${key} reponses`);
                    responses[key] = [{text:response_text}, {user:userid}, {user_answer:user?.uid}, date, fileUrl, questionId];
                    setResponses(responses);
                    updateResponses();                    
                }            
    
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('Patienter le temps que le fichier se charge ...')
        }        
    };


    const handleUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            // alert("Please choose a file first!")
            console.log('not file');
            return false;
        }
     
        const storageRef = ref(storage,`/photo/question/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);
     
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
     
                // update progress
                setPercent(percent);
                if (percent != 100) {
                    setIsready(false);
                }
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    if (url) {
                        console.log(url)
                        setUrl(url);
                        setIsready(true);
                    }
                });
            }
        ); 
    }


    const signalQuestion = async () => {
        activeNetworkAcces();
        try {
            const docRef = doc(db, "admin", "signal");
            const docSnap = await getDoc(docRef);
            const data = docSnap.data();
            let newSignal = data.signales;
            let key = parseInt(Object.keys(newSignal).at(-1))+1;
            if (isEmpty(newSignal)) {
                newSignal = {}
                key = 0;
            }
            console.log(`On a deja ${Object.keys(newSignal).length} newSignal`);
            newSignal[key] = [userid, questionId];    
            await updateDoc(docRef, {
                signales: newSignal
            });
            alert("signal envoyer merci !!!");
            
        } catch (error) {
            console.log(error);
        }
    }

    

    function switchToProfile() {
        window.location = `/user?${name}#${userid}`;
    }

    useEffect(() => {
        if (loading) return;
        if (!questionId) return navigate("/sign");
        
        fetchUserName();
        fetchUserQuestions();
        
    }, [user, loading]);

    if (userid === user?.uid) {
        return (
            <>
                <Header />

                <button onClick={switchToProfile}>{name}</button>
                <h3>Question</h3>
                <p>titre : {title}</p>
                <p>text : {text}</p>
                <p id="tags">tags: </p>
                <p>publier le : {date}</p>
                <img src={questionPhoto} alt="Photo"/>
                <p id="resp">reponses : </p>

                <div>
                    <label>
                        Contenu de la reponse:
                        <textarea id="response_text"></textarea>
                    </label><br></br>
                    <label>
                        Photo:
                        <input type="file" accept="/image/*" onChange={handleUpload}/>
                        <p>{percent} "%"</p>
                    </label>
                    <button onClick={createNewResponses}>repondre</button>
                </div>

                <button onClick={deleteQuestion}>supprimer la question</button>

                <Footer />
            </>
        )
    } else {
        return (
            <>
                <Header />

                <button onClick={switchToProfile}>{name}</button>
                <h3>Question</h3>
                <p>titre : {title}</p>
                <p>text : {text}</p>
                <p id="tags">tags: </p>
                <p>publier le : {date}</p>
                <img src={questionPhoto} alt="Photo"/>
                <p id="resp">reponses : </p>

                <div>
                    <label>
                        Contenu de la reponse:
                        <textarea id="response_text"></textarea>
                    </label><br></br>
                    <label>
                        Photo:
                        <input type="file" accept="/image/*" onChange={handleUpload}/>
                        <p>{percent} %</p>
                    </label>
                    <button onClick={createNewResponses}>repondre</button>

                    <button onClick={signalQuestion}>signaler</button>

                </div>

                <Footer />
            </>
        )
    }

    
}

export default ReadQuestion;