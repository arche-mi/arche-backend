import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth,db,stopNetworkAcces,activeNetworkAcces, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

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
            try {
                userPhotoFetch = data.userPhoto;
                console.log(userPhotoFetch);
            } catch (error) {
                userPhotoFetch = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJFfdPAfeJKYiwglp2z9IjDwphJAqEgyAsUv9nfcDLPVXRPzL2B0pLAvUoyVf4QTzoyso&usqp=CAU";
            }
            setPhoto(userPhotoFetch);
        } catch (err) {
            console.error(err);
        }
        // stopNetworkAcces();
    }; 

    useEffect(() => {
        if (loading) return;     

        fetchUserInfo();
        
    }, [user, loading]);

    if (!user) {
        return (
            <>        
                <a href="/">Arch</a>
                <a href="/sign">Login</a>
            </>
        )
    } else {
        return (
            <>        
                <a href="/">Arch</a>
                <img src={photo} alt="Photo"/>
            </>
        )
    };
   
}

export default Header;