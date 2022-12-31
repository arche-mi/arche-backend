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
        <>
            <button onClick={switchToBlog}>blog</button>
        </>
    )
}

export default Footer;