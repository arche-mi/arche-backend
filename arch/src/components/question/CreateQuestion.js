import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, setDoc, updateDoc, addDoc} from "firebase/firestore";
import { isEmpty, map } from "@firebase/util";

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

    const create = async () => {
        try {       
            const title = document.querySelector('#title').value;
            const text = document.querySelector('#text').value;
            const tags = document.querySelector('#title').value;    
            if (title === '' || text === '' || tags === '') {
                return false;
            } else {               
                const date = new Date();
                let key = Object.keys(questions).length;
                if (isEmpty(questions)) {
                    setQuestions({});
                    key = -1;
                }
                questions[key] = [{title:title}, {text:text}, {tags:tags}, date];
                console.log(questions);

                console.log(name);
                const userDocByName = doc(db, "users", name);
                await updateDoc(userDocByName, {
                    questions: questions
                });
                window.location.reload();
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
                <button onClick={create}>Poser</button>
        </div>
    )
}

export default CreateQuestion;