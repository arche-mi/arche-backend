import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import "./footer.css";

function Footer() {
    const [user, loading] = useAuthState(auth);

    function switchToDonation() {
        window.location.href = `/donation?${user.displayName}`;
    }
    function switchToBlog() {
        window.location.href = `/blog#${user.uid}`;
    }
    function switchToBadges() {
        window.location.href = `/badges#${user.uid}`;
    }
    function switchToHome() {
        window.location.href = `/`;
    }
    function switchToLibrairie() {
        window.location.href = `/${user.displayName}}`;
    }

    return (
        <>
            <footer>
                <div class="content-text">
                    <div class="text1">
                        <h1 onClick={switchToHome} class="arche">Arche</h1>
                        <ul>
                            <li onClick={switchToHome}>Toutes les questions</li>
                            <li onClick={switchToHome}>Utilisateurs</li>
                            <li>Contact</li>
                            <li><a href="mailto:hamedcuenca5@gmail.com">Devenir contributeur</a></li>
                        </ul>
                    </div>
                    <div class="termes">
                        <div class="text2">
                            <ul>
                                <li onClick={switchToBlog}>Blog</li>
                                <li onClick={switchToBadges}>Badges</li>
                                <li onClick={switchToLibrairie}>Librairie</li>
                            </ul>
                        </div>
                        <div class="text3">
                            <ul>
                                <li>Termes of use</li>
                                <li>Tips</li>
                            </ul>
                        </div>
                    </div>
                    <div class="text4">
                        <h1>Follow us</h1>
                        <div class="img">
                            <ul>
                                <li><img src="https://img.icons8.com/material/24/228BE6/facebook-new.png"/></li>
                                <li><img src="https://img.icons8.com/material/24/228BE6/youtube-play--v1.png"/></li>
                                <li><img src="https://img.icons8.com/material/24/228BE6/whatsapp--v1.png"/></li>
                            </ul>
                        </div>
                        <div class="archeBeta">
                            <ul>
                                <li>Arche Beta</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;