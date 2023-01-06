import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,db,stopNetworkAcces,activeNetworkAcces, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import "./header.css";

import ring from "../../assets/images/ring.svg";

function Header() {
    const [user, loading] = useAuthState(auth);
    const [photo, setPhoto] = useState();    
    const [userData, setData] = useState();

    let userid = null;
    try {
        userid = window.location.href.split('#')[1];
    } catch (err) {
        console.log(err);
    }


    // Fetch username by uid
    const fetchUserInfo = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setData(data);
            let userPhotoFetch = 0;                
            userPhotoFetch = data.userPhoto;
            console.log(userPhotoFetch);
            setPhoto(userPhotoFetch);
        } catch (err) {
            console.error(err);
        }
        // stopNetworkAcces();
    }; 

    function switchToSign() {
        window.location.href = '/sign';
    }
    function switchToProfile() {
        window.location = `/user?${user?.uid}#${user?.uid}`;
    }
    function switchToHome() {
        window.location = `/`;
    }
    function switchToChat() {
        window.location.href = `/chat`;
    }
    function switchToLibrairie() {
        window.location.href = `/librairie#${user.displayName}`
    }
    function switchToFeedback() {
        window.location = `/feedback?${user.displayName}`
    }

    useEffect(() => {
        if (loading) return;     

        fetchUserInfo();
        
    }, [user, loading]);

    if (!user) {
        return (
            <>        
            <header>
                <section id="logo">
                    <h3 onClick={switchToHome} id="arche">Arche</h3>
                    <p id="beta">Beta</p>
                </section>
                <section id="header-btn">
                    <button onClick={switchToSign} type="button" class="btn-primary-header" id="login-btn">Login</button>
                </section>
            </header>
            <hr className="hr-header"></hr>
            </>
        )
    } else {
        return (

            <>     
            <header>                   
                <section id="logo">
                    <h3 onClick={switchToHome} id="arche">Arche</h3>
                    <p onClick={switchToFeedback} id="beta">Beta</p>
                </section>
                <section id="img-btn">
                    <img id="user-img" onClick={switchToProfile} src={photo} />
                    <button onClick={switchToLibrairie} type="button" class="btn-primary-header">librairie</button>                    
                    <button onClick={switchToChat} type="button" class="chat-btn-header">Chat</button>
                    <div className="chat-ring-ring">
                        <img onClick={switchToChat} className="ring" src={ring} />
                    </div>
                </section>
            </header>                                     
            <hr className="hr-header"></hr>
            </>
        )
    };
   
}

export default Header;