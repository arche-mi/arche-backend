import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithGoogle,auth } from "../../firebase";


function Sign() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    function switchToSign(param) {
      const check = document.querySelector('#check');
      if (check.checked == true) {
        signInWithGoogle();
      } else {
        // alert('');
      }
      
    }
    
    useEffect(() => {
      if (loading) return;
      if (user) navigate("/");
      
    }, [user, loading]);


    return (
        <>
          <button onClick={switchToSign}>sign up with google to start</button>      
          <input type="checkbox" id="check" name="check"></input>
        </>
    )
}

export default Sign;