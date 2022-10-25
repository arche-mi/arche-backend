import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function ReadQuestion() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();    
    const [title, setTitle] = useState();
    const [text, setText] = useState();
    const [tags, setTags] = useState();
    const [date, setDate] = useState();

    const questionId = window.location.href.split('?')[1];


    const fetchUserQuestions = async () => {
        let questions = null;        
        try {
            const q = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            //await sleep(1000);
            
            if (!data.questions) {
                questions = {};
            } else {
                questions = data.questions
            }
            setTitle(Object.values(questions[questionId][0])[0]);
            setText(Object.values(questions[questionId][1])[0]);
            setTags(Object.values(questions[questionId][2])[0]);
            setDate(Object.values(questions[questionId][4]));

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/sign");
        if (!questionId) return navigate("/sign");
        
        fetchUserQuestions();
    }, [user, loading]);


    return (
        <div>
            <h3>Question</h3>
            <p>titre : {title}</p>
            <p>text : {text}</p>
            <p>tags : {tags}</p>
            <p>date de publication : {date}</p>
        </div>
    )
}

export default ReadQuestion;