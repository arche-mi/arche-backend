import Footer from "../footer/Footer";
import Header from "../header/Header";

import notf from "../../assets/images/404.svg";
import './notFound.css';

function NotFound() {
    return (
        <>
            <Header />

            <div className="not-found-content">
                <center><img src={notf} /></center>
                <h1>Page Not Found</h1>
                <p>Sorry, the page you are looking for could not be found. It may have been moved, deleted, or the URL may have been typed incorrectly.
                Please check the URL and try again. If you continue to experience issues, please contact the site administrator.</p>
            </div>

            <Footer />
        </>
    )
}

export default NotFound;