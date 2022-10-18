import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

import { signInWithGoogle,auth } from "../../firebase";


function Sign() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();
    
    useEffect(() => {
      if (loading) return;
      if (user) navigate("/users");
    }, [user, loading]);


    return (
        <button onClick={signInWithGoogle}>sign up with google to start</button>        
    )
}

export default Sign;