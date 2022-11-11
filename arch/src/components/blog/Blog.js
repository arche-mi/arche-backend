import { async } from "@firebase/util";
import React, { useEffect, useState } from "react";
import { auth,db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where, doc } from "firebase/firestore";


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


    const fetchBlogs = async () => {
        try {
            const q = query(collection(db, "blog"));
            const doc = await getDocs(q);
            const data = doc.docs;
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
                button.onclick = newLike(userid, data.indexOf(item), blogData);
                button.innerHTML = "j'aime";
                ul.appendChild(button)

                li = document.createElement("li");                
                li.innerText = item.data().likes + " likes";
                ul.appendChild(li);                
                           
                blog_area.appendChild(ul);
            })
            
        } catch (error) {
            console.log(error)            
        }
    }

    function newLike(userid, article_id, data) {
        let like = 0;
        data.forEach((item) => {
            if (data.indexOf(item) === article_id) {
                like = parseInt(data[article_id].data().likes);
            }
        })
        console.log(like)

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