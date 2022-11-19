import { async } from "@firebase/util";
import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { doc, updateDoc} from "firebase/firestore";
import "./blog.css";


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
            
            data
            .slice()
            .reverse()
            .forEach(item => {
                let ul = document.createElement("ul");

                let li_title = document.createElement("li");                
                li_title.classList.add('title');
                li_title.innerText = item.data().title.toUpperCase();
                ul.appendChild(li_title);  

                let li_date = document.createElement("li");
                li_date.classList.add('date');
                li_date = document.createElement("li");                
                li_date.innerText = item.data().date;
                ul.appendChild(li_date);
                
                let li_content = document.createElement("li");
                li_content.classList.add('content');
                li_content = document.createElement("li");                
                li_content.innerText = item.data().content;
                ul.appendChild(li_content);

                let file = document.createElement("img");
                file.classList.add('title');
                file.src = item.data().file;
                ul.appendChild(file);                               

                let button = document.createElement("button");
                button.classList.add('like_bnt');
                button.onclick = function() {updateLike(item.data(), data.indexOf(item))};
                button.innerHTML = "j'aime";
                ul.appendChild(button)

                let li_like = document.createElement('li');
                li_like = document.createElement("li");              
                li_like.classList.add('like');
                li_like.innerText = item.data().likes + " likes";
                ul.appendChild(li_like);  

                // let view =  parseInt(item.data().views) + 1;
                // updateView(item.data(), data.indexOf(item));
                
                // li = document.createElement("li");                
                // li.innerText = view + " interaction";
                // ul.appendChild(li);  
                           
                blog_area.appendChild(ul);
            });  
            
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