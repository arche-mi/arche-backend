import React, { useEffect, useState } from "react";
import { activeNetworkAcces, auth,db,stopNetworkAcces } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, getDoc, updateDoc} from "firebase/firestore";
import './librairie.css';
import pdf from "../../assets/images/pdf.svg";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import LoadingSpinner from "../loadSpinner/LoadingSpinner";


function Librairie() {
    const [isLoading, setIsLoading] = useState(false);
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

                // fetchLibrairie();
            } catch (error) {
                console.log(error)
            }
            fetchFavoris();
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

                // fetchLibrairie();
            } catch (error) {
                console.log(error)
            }
            fetchFavoris();
        }       
    }

    
    const fetchFavoris = async () => {        
        try {            
            setIsLoading(true);
            const q = query(collection(db, "librairie"));
            const doct = await getDocs(q);
            const data = doct.docs;
            setlibrairieData(data);            
            
            const quser = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doctuser = await getDocs(quser);
            const datauser = doctuser.docs[0].data();
            let currentDoc = datauser.docs;

            let lib_area = document.querySelector("#lib-area");
            lib_area.innerHTML = "";
            
            data
            .slice()
            .reverse()
            .forEach(item => {

                if (currentDoc.includes(item.data().title.toLowerCase())) {
                    let lib_item = document.createElement('div');
                    lib_item.classList.add('lib-item');
                    let lib_cta = document.createElement('div');
                    lib_cta.classList.add('lib-cta');                

                    let file = document.createElement("img");
                    file.src = pdf;
                    lib_item.appendChild(file);  
    
                    let doclink = document.createElement("a");
                    let doclinktext = document.createTextNode(item.data().title);
                    doclink.appendChild(doclinktext);
                    lib_cta.appendChild(doclink);
                    // a.title = "more";
                    doclink.href = `${item.data().ref}`;                                                                                      
    
                    let button = document.createElement("div");
                    button.classList.add('moin');
                    button.onclick = function() {updateLike(item.data(), item.data().title)};
                    button.innerHTML = "-";
                    lib_cta.appendChild(button);
                    lib_item.appendChild(lib_cta);

                    let p_level = document.createElement("p");                
                    p_level.innerText = item.data().level;
                    lib_item.appendChild(p_level);  

                    lib_area.appendChild(lib_item);        
                }
               
            });  
            
        } catch (error) {
            console.log(error)            
        }
        setIsLoading(false);
        stopNetworkAcces();
    }

    const fetchLevel = async (level) => {
        try {     
            setIsLoading(true);       
            const q = query(collection(db, "librairie"));
            const doct = await getDocs(q);
            const data = doct.docs;
            setlibrairieData(data);            

            const quser = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doctuser = await getDocs(quser);
            const datauser = doctuser.docs[0].data();
            let currentDoc = datauser.docs;

            let lib_area = document.querySelector("#lib-area");
            lib_area.innerHTML = "";
            
            data
            .slice()
            .reverse()
            .forEach(item => {

                if ((item.data().level).split(' ')[0] == level && currentDoc.includes(item.data().title.toLowerCase())) {
                    let lib_item = document.createElement('div');
                    lib_item.classList.add('lib-item');
                    let lib_cta = document.createElement('div');
                    lib_cta.classList.add('lib-cta');                

                    let file = document.createElement("img");
                    file.src = pdf;
                    lib_item.appendChild(file);  
    
                    let doclink = document.createElement("a");
                    let doclinktext = document.createTextNode(item.data().title);
                    doclink.appendChild(doclinktext);
                    lib_cta.appendChild(doclink);
                    // a.title = "more";
                    doclink.href = `${item.data().ref}`;                                                                                      
    
                    let button = document.createElement("div");
                    button.classList.add('moin');
                    button.onclick = function() {updateLike(item.data(), item.data().title)};
                    button.innerHTML = "-";
                    lib_cta.appendChild(button);
                    lib_item.appendChild(lib_cta);

                    let p_level = document.createElement("p");                
                    p_level.innerText = item.data().level;
                    lib_item.appendChild(p_level);  

                    lib_area.appendChild(lib_item);                    
                }
                if ((item.data().level).split(' ')[0] == level && !currentDoc.includes(item.data().title.toLowerCase())) {
                    let lib_item = document.createElement('div');
                    lib_item.classList.add('lib-item');
                    let lib_cta = document.createElement('div');
                    lib_cta.classList.add('lib-cta'); 

                    let file = document.createElement("img");
                    file.src = pdf;
                    lib_item.appendChild(file);  
    
                    let doclink = document.createElement("a");
                    let doclinktext = document.createTextNode(item.data().title);
                    doclink.appendChild(doclinktext);
                    lib_cta.appendChild(doclink);
                    // a.title = "more";
                    doclink.href = `${item.data().ref}`;                                                                       
    
                    let button = document.createElement("div");
                    button.classList.add('plus');
                    button.onclick = function() {updateLike(item.data(), item.data().title)};
                    button.innerHTML = "+";
                    lib_cta.appendChild(button);
                    lib_item.appendChild(lib_cta);

                    let p_level = document.createElement("p");                
                    p_level.innerText = item.data().level;
                    lib_item.appendChild(p_level); 

                    lib_area.appendChild(lib_item);                 
                }
               
            });  
            
        } catch (error) {
            console.log(error)            
        }
        setIsLoading(false);
        stopNetworkAcces();
    }
   


    const fetchLibrairie = async () => {
        try {          
            setIsLoading(true);  
            const q = query(collection(db, "librairie"));
            const doct = await getDocs(q);
            const data = doct.docs;
            setlibrairieData(data);      

            const quser = query(collection(db, "users"), where("uid", "==", user?.uid));
            const doctuser = await getDocs(quser);
            const datauser = doctuser.docs[0].data();
            let currentDoc = datauser.docs;      

            console.log(librairieData);

            let lib_area = document.querySelector("#lib-area");
            lib_area.innerHTML = "";                     
            
            data
            .slice()
            .reverse()
            .forEach(item => {
                if (currentDoc.includes(item.data().title.toLowerCase())) {    
                    let lib_item = document.createElement('div');
                    lib_item.classList.add('lib-item');
                    let lib_cta = document.createElement('div');
                    lib_cta.classList.add('lib-cta');                

                    let file = document.createElement("img");
                    file.src = pdf;
                    lib_item.appendChild(file);  
    
                    let doclink = document.createElement("a");
                    let doclinktext = document.createTextNode(item.data().title);
                    doclink.appendChild(doclinktext);
                    lib_cta.appendChild(doclink);
                    // a.title = "more";
                    doclink.href = `${item.data().ref}`;                                                                                      
    
                    let button = document.createElement("div");
                    button.classList.add('moin');
                    button.onclick = function() {updateLike(item.data(), item.data().title)};
                    button.innerHTML = "-";
                    lib_cta.appendChild(button);
                    lib_item.appendChild(lib_cta);

                    let p_level = document.createElement("p");                
                    p_level.innerText = item.data().level;
                    lib_item.appendChild(p_level);  

                    lib_area.appendChild(lib_item);    
                } else {
                    let lib_item = document.createElement('div');
                    lib_item.classList.add('lib-item');
                    let lib_cta = document.createElement('div');
                    lib_cta.classList.add('lib-cta'); 

                    let file = document.createElement("img");
                    file.src = pdf;
                    lib_item.appendChild(file);  
    
                    let doclink = document.createElement("a");
                    let doclinktext = document.createTextNode(item.data().title);
                    doclink.appendChild(doclinktext);
                    lib_cta.appendChild(doclink);
                    // a.title = "more";
                    doclink.href = `${item.data().ref}`;                                                                       
    
                    let button = document.createElement("div");
                    button.classList.add('plus');
                    button.onclick = function() {updateLike(item.data(), item.data().title)};
                    button.innerHTML = "+";
                    lib_cta.appendChild(button);
                    lib_item.appendChild(lib_cta);

                    let p_level = document.createElement("p");                
                    p_level.innerText = item.data().level;
                    lib_item.appendChild(p_level); 

                    lib_area.appendChild(lib_item);
                }
                
            });  
            
        } catch (error) {
            console.log(error)            
        }
        setIsLoading(false);
        stopNetworkAcces();
    }


    function fetchLicence() {
        fetchLevel("Licence");
    }
    function fetchMaster() {
        fetchLevel("Master");
    }


    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/landing");
        if (!username) navigate("/");
        fetchLibrairie();   

        // state form script menu
        const tout = document.querySelector('.tout-lib');
        const master = document.querySelector('.master-lib');
        const lic = document.querySelector('.lic-lib');
        const fav = document.querySelector('.fav-lib');
        tout.addEventListener('click', () => {
            tout.style.background = 'rgba(5, 56, 225, 0.961)';
            master.style.background = 'rgb(124, 152, 255)';
            lic.style.background = 'rgb(124, 152, 255)';
            fav.style.background = 'rgba(53, 220, 90, 0.61)';
        });      
        master.addEventListener('click', () => {
            master.style.background = 'rgba(5, 56, 225, 0.961)';
            tout.style.background = 'rgb(124, 152, 255)';
            lic.style.background = 'rgb(124, 152, 255)';
            fav.style.background = 'rgba(53, 220, 90, 0.61)';
        });      
        lic.addEventListener('click', () => {
            lic.style.background = 'rgba(5, 56, 225, 0.961)';
            tout.style.background = 'rgb(124, 152, 255)';
            master.style.background = 'rgb(124, 152, 255)';
            fav.style.background = 'rgba(53, 220, 90, 0.61)';
        });      
        fav.addEventListener('click', () => {
            fav.style.background = '#27BC48';
            tout.style.background = 'rgb(124, 152, 255)';
            lic.style.background = 'rgb(124, 152, 255)';
            master.style.background = 'rgb(124, 152, 255)';
        });            
        
    }, [user, loading]);


    return (
        <>
        <Header />
        
        <div class="lib-content">
            <div class="title"><h1>Librairie</h1></div>
            <div class="menu-lib">
                <button onClick={fetchLibrairie} class="tout-lib">Tout</button>
                <button onClick={fetchMaster} class="master-lib">Master</button>
                <button onClick={fetchLicence} class="lic-lib">Licence</button>
                <button onClick={fetchFavoris} class="fav-lib">Favoris</button>
            </div>
            {/* {isLoading ? <LoadingSpinner /> : fetchLibrairie} */}
            <div class="lib-area" id="lib-area">
            </div>
            <div class="contact-support ajout">
                <a href="mailto:hamedcuenca5@gmail.com">Contacter le support pour ajouter un document +</a>
            </div>
        </div>
        
        <Footer />
        </>
    )
}

export default Librairie;