import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";


function Footer() {
    const [user, loading] = useAuthState(auth);

    function switchToDonation() {
        window.location.href = `/donation?${user.displayName}`;
    }
    function switchToBlog() {
        window.location.href = `/blog#${user.uid}`;
    }

    return (
        <div>
            <h1>Footer ici</h1>
            <h1><button onClick={switchToBlog}>blog</button></h1>
            {/* <h1><button onClick={switchToDonation}>Faire un don !</button></h1> */}
        </div>
    )
}

export default Footer;