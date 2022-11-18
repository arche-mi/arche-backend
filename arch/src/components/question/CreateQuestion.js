import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";
import { isEmpty } from "@firebase/util";
import storage from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function CreateQuestion() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [name, setName] = useState();
    const [questions, setQuestions] = useState();

    // State to store uploaded file
    //const [file, setFile] = useState("");
    const [fileUrl, setUrl] = useState("");
    // progress
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
    
                    console.log(name);
                    const userDocByUsername = doc(db, "users", name);
                    await updateDoc(userDocByUsername, {
                        questions: questions
                    });
                    window.location = `/question?${+key}!${user?.uid}#${user?.uid}`;
                }            
    
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('Patienter le temps que le fichier se charge ...')
        }        
    };

    // Handles input change event and updates state
    // function handleChange(event) {
    //     setFile();
    //     handleUpload();
    // }

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
                <label>
                    Photo:
                    <input type="file" accept="/image/*" onChange={handleUpload}/>
                    <p>{percent} "%"</p>
                </label>
                <button onClick={createNewQuestion}>Poser</button>
        </div>
    )
}

export default CreateQuestion;