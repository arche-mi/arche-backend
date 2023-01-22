import React, { useEffect, useState } from "react";
import { auth,db,stopNetworkAcces,activeNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";
import { isEmpty } from "@firebase/util";
import storage from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import './createQuestion.css';


function CreateQuestion() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [questions, setQuestions] = useState();

    const [fileUrl, setUrl] = useState("");
    const [percent, setPercent] = useState(0);
    const [isReady, setIsready] = useState(true);


    const fetchUserName = async () => {
        try {        
          const q = query(collection(db, "users"), where("uid", "==", user?.uid));
          const doc = await getDocs(q);
          const data = doc.docs[0].data();
        
          setName(data.name);
        } catch (err) {
          console.error(err);
        }
    }; 
    

    const fetchUserQuestions = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            if (!data.questions) {
                const questions = {};                
                data.questions = questions;
            }
            setQuestions(data.questions);
        } catch (error) {
            console.log(error);
        }
    }


    const createNewQuestion = async () => {
        if (isReady) {
            try {       
                const title = document.querySelector('#title').value;
                const text = document.querySelector('#text').value;
                const tags = document.querySelector('#tags').value; 
                const responses = {};
                if (title === '' || text === '' || tags === '') {
                    alert("remplissez tout les champs svp");
                    return false;
                } else {               
                    const date = new Date();
                    let key = parseInt(Object.keys(questions).at(-1))+1;
                    if (isEmpty(questions)) {
                        setQuestions({});
                        key = 0;
                    }
                    console.log(`On a deja ${Object.keys(questions).length} questions`);
                    questions[key] = [{title:title}, {text:text}, {tags:tags.split(',')}, {responses:responses}, date, fileUrl];
                    const userDocByUsername = doc(db, "users", name);
                    // activeNetworkAcces();
                    await updateDoc(userDocByUsername, {
                        questions: questions
                    });
                    // stopNetworkAcces();
                    window.location = `/question?${+key}!${user?.uid}`;
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


    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/sign");

       fetchUserName();
       fetchUserQuestions();
    //    stopNetworkAcces();
    }, [user, loading]);

    
    return (
        
        <>
            <Header />       

                <div class="create-container">
                    <main class="create-main">
                        <h1>Poser une question ?</h1>

                        <div class="block1">
                            <p className="create-titre">Titre</p>
                            <p className="create-p">Soyez précis et imaginez que vous posez une question à une autre personne.</p>
                            <input type="text" id="title" name="title" />
                        </div>

                        <div class="block2">
                            <p className="create-titre">Contenu</p>
                            <p className="create-p">Présentez le problème et développez ce que vous avez mis dans le titre. Minimum 20 caractères.</p>
                            <textarea className="create-textarea" id="text"></textarea>
                        </div>

                        <div class="block3">
                            <p className="create-titre">Tags</p>
                            <p className="create-p">Ajouter des tags(séparer par des virgules) pour décrire le sujet de votre question.</p>
                            <input type="text" id="tags" name="tags" />
                        </div>

                        <label className="create-label">
                            Photo:
                            <input type="file" accept="/image/*" onChange={handleUpload}/>
                            <p className="create-percent">{percent} "%"</p>
                        </label>

                        <div class="button">
                            <a onClick={createNewQuestion}>Poser</a>
                        </div>
                    </main>
                </div> 
        

            <Footer />

        </>
    )
}

export default CreateQuestion;