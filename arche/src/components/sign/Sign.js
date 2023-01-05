import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithGoogle,auth } from "../../firebase";

import './sign.css';

function Sign() {
    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    function switchToSign() {
      const check = document.querySelector('#check');
      if (check.checked == true) {
        signInWithGoogle();
      } else {
        // alert('');
      }
      
    }

    function switchToPrivacy() {
      window.location.href = '/privacy-policy';
    }
    
    useEffect(() => {
      if (loading) return;
      if (user) navigate("/");
      
    }, [user, loading]);


    return (
        <>
          <div id="conteneurprincipale">
            <div class="regle">
                <h3>Règles et conditions d'utilisation</h3>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas corporis sit rerum hic! 
                Neque amet fugiat ad et reprehenderit velit eius fugit,
                recusandae, quia ea suscipit est rem, eum aut!        
            </div>
            <div class="lien">
                <div onClick={switchToPrivacy} class="texte">
                    j'ai lu et j'accepte les règles ainsi que les conditions d'utilisations.
                </div>
                <div class="check">
                    <label class="switch">
                        <input type="checkbox" id="check" name="check"></input>
                        <span></span>
                    </label>
                   
                </div>        
            </div>
            <div class="seconnecter" >
                <button onClick={switchToSign} id="button" class="button" name="Seconnecter">Se connecter avec google</button>                
            </div>
        
        </div>
        </>
    )
}

export default Sign;