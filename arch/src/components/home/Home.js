import { signInWithGoogle } from "../../firebase";
  

function Home() {
    return (
        <div>
            <p>Page d;aceuille</p>
            <button onClick={signInWithGoogle}>S'inscrire avec Google</button> 
        </div>
    )
}

export default Home;