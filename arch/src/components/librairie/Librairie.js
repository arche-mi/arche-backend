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

                let li_title = document.createElement("li");                
                li_title.classList.add('title');
                li_title.innerText = item.data().title.toUpperCase();
                ul.appendChild(li_title);  

                console.log(item.data().ref)

                let file = document.createElement("img");
                file.classList.add('title');
                file.src = item.data().ref;
                ul.appendChild(file);                               

                // let button = document.createElement("button");
                // button.classList.add('like_bnt');
                // button.onclick = function() {updateLike(item.data(), data.indexOf(item))};
                // button.innerHTML = "j'aime";
                // ul.appendChild(button)

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