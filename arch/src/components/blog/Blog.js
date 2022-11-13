import { async } from "@firebase/util";
import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";


function Blog() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    const [blogData, setBlogData] = useState();   
 

    let userid = null;
    try {
        userid = window.location.href.split('#')[1];
    } catch (err) {
        console.log(err);
    }


    const updateLike = async (it, id) => {
        let userwholike = it.userWhoAlreadyLike;
        if (userwholike.includes(userid)) {
            let newuserwholike = [];
            userwholike.forEach((item) => {
                if (item != userid) {
                    newuserwholike.push(item)
                }
            });
            const article_id = String(id+1);
            const likes = parseInt(it.likes)-1;
            try {
                const blogDoc = doc(db, "blog", article_id);
                await updateDoc(blogDoc, {
                    likes: likes,
                    userWhoAlreadyLike: newuserwholike
                });
                fetchBlogs();
            } catch (error) {
                console.log(error)
            }
        } else {
            const article_id = String(id+1);
            const likes = parseInt(it.likes)+1;
            userwholike.push(userid)
            try {
                const blogDoc = doc(db, "blog", article_id);
                await updateDoc(blogDoc, {
                    likes: likes,
                    userWhoAlreadyLike: userwholike
                });
                fetchBlogs();
            } catch (error) {
                console.log(error)
            }
        }        
    }

    const updateView = async (it, id) => {
        const article_id = String(id+1);
        const views = parseInt(it.views)+1;
        try {
            const blogDoc = doc(db, "blog", article_id);
            await updateDoc(blogDoc, {
                views: views
            });
        } catch (error) {
            console.log(error)
        }        
    }

    const fetchBlogs = async () => {
        try {            
            const q = query(collection(db, "blog"));
            const doct = await getDocs(q);
            const data = doct.docs;
            setBlogData(data);            

            let blog_area = document.querySelector("#blog_area");
            if (blog_area.textContent != "") { blog_area.textContent = "" };
            
            data.forEach((item) => {
                let ul = document.createElement("ul");

                let li = document.createElement("li");                
                li.innerText = item.data().title.toUpperCase();
                ul.appendChild(li);  

                let file = document.createElement("img")
                file.src = item.data().file;
                ul.appendChild(file);               

                li = document.createElement("li");                
                li.innerText = item.data().content;
                ul.appendChild(li);

                li = document.createElement("li");                
                li.innerText = item.data().date;
                ul.appendChild(li);

                let button = document.createElement("button");
                button.onclick = function() {updateLike(item.data(), data.indexOf(item))};
                button.innerHTML = "j'aime";
                ul.appendChild(button)

                li = document.createElement("li");                
                li.innerText = item.data().likes + " likes";
                ul.appendChild(li);  

                // let view =  parseInt(item.data().views) + 1;
                // updateView(item.data(), data.indexOf(item));
                
                // li = document.createElement("li");                
                // li.innerText = view + " vues";
                // ul.appendChild(li);  
                           
                blog_area.appendChild(ul);
            })
            
        } catch (error) {
            console.log(error)            
        }
    }


    useEffect(() => {
        if (loading) return;
        if (!user) navigate("/landing");

        fetchBlogs();    
    }, [user, loading]);


    return (
        <div>
            <h1>Blog</h1>
            <div id="blog_area"></div>
        </div>
    )
}

export default Blog;