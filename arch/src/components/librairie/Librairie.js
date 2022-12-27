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



function Librairie() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [librairieData, setlibrairieData] = useState();   

    let username = null;
    try {
        username = window.location.href.split('#')[1].split('%20').join(' ');
    } catch (err) {
        console.log(err);
    }
    

    const updateLike = async (it, name) => {
        console.log(it, name, username);
        activeNetworkAcces();
        let userwholike = it.userWhoLike;
        if (userwholike.includes(user.uid)) {
            console.log("deja");
            // const button = document.querySelector('#fav_bnt');
            // button.style.color = "gray";

            let newuserwholike = [];
            userwholike.forEach((item) => {
                if (item != user.uid) {
                    newuserwholike.push(item)
                }
            });
            try {
                const blogDoc = doc(db, "librairie", it.title.toLowerCase());
                await updateDoc(blogDoc, {
                    userWhoLike: newuserwholike
                });

                // update user docs
                const q = query(collection(db, "users"), where("uid", "==", user?.uid));
                const doct = await getDocs(q);
                const data = doct.docs[0].data();
                let currentDoc = data.docs;
                let newuserDocs = [];
                currentDoc.forEach((item) => {
                    if (item != it.title.toLowerCase()) {
                        newuserDocs.push(item)
                    }
                });
                const userDocByUsername = doc(db, "users", username);
                await updateDoc(userDocByUsername, {
                    docs: newuserDocs
                });

                fetchLibrairie();
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("pas deja");
            // const button = document.querySelector('#fav_bnt');
            // button.style.color = "red";

            userwholike.push(user.uid)
            try {
                console.log(userwholike)
                const blogDoc = doc(db, "librairie", it.title.toLowerCase());
                await updateDoc(blogDoc, {
                    userWhoLike: userwholike
                });

                // update user docs
                const q = query(collection(db, "users"), where("uid", "==", user?.uid));
                const doct = await getDocs(q);
                const data = doct.docs[0].data();
                let currentDoc = data.docs;
                currentDoc.push(it.title.toLowerCase());
                const userDocByUsername = doc(db, "users", username);
                await updateDoc(userDocByUsername, {
                    docs: currentDoc
                });

                fetchLibrairie();
            } catch (error) {
                console.log(error)
            }
        }       
    }


    const fetchLibrairie = async () => {
        try {            
            const q = query(collection(db, "librairie"));
            const doct = await getDocs(q);
            const data = doct.docs;
            setlibrairieData(data);            

            console.log(librairieData);

            let lib_area = document.querySelector("#lib-area");
            if (lib_area.textContent != "") { lib_area.textContent = "" };
            
            data
            .slice()
            .reverse()
            .forEach(item => {
                let ul = document.createElement("ul");

                let li_level = document.createElement("li");                
                li_level.classList.add('title');
                li_level.innerText = item.data().level;
                ul.appendChild(li_level);  

                let doclink = document.createElement("a");
                let doclinktext = document.createTextNode(item.data().title);                
                doclink.appendChild(doclinktext);
                ul.appendChild(doclink);
                // a.title = "more";
                doclink.href = `${item.data().ref}`;
                                              

                let button = document.createElement("button");
                button.classList.add('fav_bnt');
                button.onclick = function() {updateLike(item.data(), item.data().title)};
                button.innerHTML = "ajouter aux favoris";
                ul.appendChild(button)

                lib_area.appendChild(ul);
            });  
            
        } catch (error) {
            console.log(error)            
        }
        stopNetworkAcces();
    }


    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/landing");
        if (!username) navigate("/");
        fetchLibrairie();       
        
    }, [user, loading]);


    return (
        <>
        <Header />

        <h1>Librairie</h1>
        <div id="lib-area"></div>

        <Footer />
        </>
    )
}

export default Librairie;