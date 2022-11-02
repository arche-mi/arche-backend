import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";
import { isEmpty } from "@firebase/util";


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function CreateQuestion() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [questions, setQuestions] = useState();


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
            //await sleep(1000);
            
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
                let key = Object.keys(questions).length;
                if (isEmpty(questions)) {
                    setQuestions({});
                    key = 0;
                }
                questions[key] = [{title:title}, {text:text}, {tags:tags.split(',')}, {responses:responses}, date];
                console.log(questions);

                console.log(name);
                const userDocByUsername = doc(db, "users", name);
                await updateDoc(userDocByUsername, {
                    questions: questions
                });
                window.location = `/question?${+key}#${user?.uid}`;
            }            

        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/sign");

       fetchUserName();
       fetchUserQuestions();
    }, [user, loading]);

    
    return (
        <div>
            <h2>Poser une question?</h2>
                <label>
                    Titre:
                    <input type="text" id="title" name="title" />
                </label><br></br>
                <label>
                    Contenu:
                    <textarea id="text"></textarea>
                </label><br></br>
                <label>
                    Tags:
                    <input type="text" id="tags" name="tags" />
                </label><br></br>
                <button onClick={createNewQuestion}>Poser</button>
        </div>
    )
}

export default CreateQuestion;