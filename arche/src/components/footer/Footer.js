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
    function switchToUsers() {
        window.location.href = `/users`;
    }
    function switchToLibrairie() {
        window.location.href = `/librairie#${user.displayName}`;
    }
    function switchToPrivacy() {
        window.location.href = '/privacy-policy';
    }

    return (
        <>
            <hr className="hr-footer"></hr>
            <footer>
                <div class="content-text">
                    <div class="text1">
                        <h1 class="arche">Arche</h1>
                        <ul>
                            <li className="el-hover-footer"  onClick={switchToHome}>Toutes les questions</li>
                            <li className="el-hover-footer"  onClick={switchToUsers}>Utilisateurs</li>
                            <li className="el-hover-footer" >Contact</li>
                            <li className="el-hover-footer" ><a href="mailto:hamedcuenca5@gmail.com">Devenir contributeur</a></li>
                        </ul>
                    </div>
                    <div class="termes">
                        <div class="text2">
                            <ul>
                                {/* <li className="el-hover-footer" onClick={switchToBlog}>Blog</li> */}
                                <li className="el-hover-footer" onClick={switchToBadges}>Badges</li>
                                <li className="el-hover-footer" onClick={switchToLibrairie}>Librairie</li>
                            </ul>
                        </div>
                        <div class="text3">
                            <ul>
                                <li onClick={switchToPrivacy} className="el-hover-footer">Termes of use</li>
                                <li className="el-hover-footer">Tips</li>
                            </ul>
                        </div>
                    </div>
                    <div class="text4">
                        <h1>Follow us</h1>
                        <div class="img">
                            <ul>
                                <li><a className="el-hover-footer" href="#">Youtube</a></li>
                                <li><a className="el-hover-footer" href="#">Facebook</a></li>
                            </ul>
                        </div>
                        <div class="archeBeta">
                            <ul>
                                <li><a className="el-hover-footer" href="mailto:hamedcuenca5@gmail.com">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;