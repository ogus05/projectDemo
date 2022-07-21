import './scss/footer.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faInstagram} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return <footer>
        <script src="https://kit.fontawesome.com/3c15a24ad4.js" crossOrigin="anonymous"></script>
        <div className="footerArticle">
            <div className="image">
                <img src="/image/logo.png"/>
            </div>
            <div className="information">
                <div>
                    <p>
                        이용약관
                    </p>
                </div>
                <div>
                    <p>
                        개인정보처리방침
                    </p>
                </div>
                <div>
                    <p>
                        자주하는질문
                    </p>
                </div>
                <div>
                    <p>
                        더리더(The Reader) | 연락처 : 010-1111-1111
                    </p>
                </div>

            </div>
            <div className="link">
                <div className="instagram">
                        <FontAwesomeIcon icon={faInstagram} />
                </div>
            </div>
        </div>
    </footer>
}

export default Footer;