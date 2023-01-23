import React, { useState, useEffect } from 'react';
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import "./stickyHeader.css";

function StickyHeader() {
    const [isSticky, setSticky] = useState(false);
    const [user, loading] = useAuthState(auth);
    const [name, setName] = useState("");

    const handleScroll = () => {
        const windowScrollTop = window.scrollY;
        if (windowScrollTop > 10) {
             setSticky(true);
        } else {
            setSticky(false);
        }
    };


    const fetchUserInfo = async () => {
        try {
            setName(user.displayName);
        } catch (err) {
            console.error(err);
        }
    }; 

 
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
        window.location.href = `/question/top`;
    }  
    function switchToTopLibrairie() {
        window.location.href = `/librairie#${name}`
    }
    function switchToBlog() {
        window.location.href = `/blog#${user.uid}`;
    }
    function switchToNewQuestion() {
        window.location.href = '/question/new';
    }
   
    useEffect(() => {
        fetchUserInfo();
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="sticky">       
            <div className='new-question'>
                <h4 onClick={switchToNewQuestion}>Nouvelle question</h4>
            </div>
            <div className='menu-left'>
                <span onClick={switchToTopQuestions} class="item active topq" data-name="01">Top Questions</span>
                <span onClick={switchToQuestions} class="item allq" data-name="02">Toutes les questions</span>
                <span onClick={switchToUnanswered} class="item unq" data-name="03">Questions non repondues</span>
                <span onClick={switchToUsers} class="item usrs"><a href="#">Utilisateurs</a></span>
            </div>
            <div className='menu-left-plus'>
                <span onClick={switchToTopLibrairie} class="btn-menu-left">Librairie</span>
                <span onClick={switchToBlog} class="btn-menu-left">Blog</span>
            </div>
        </div>
    );}

export default StickyHeader;