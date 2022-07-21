import ReactDOM from "react-dom";
import React, { useEffect, useState } from 'react';
import './scss/welcome.scss';
import Modal from 'react-modal';
import { LoginModal } from "./login.modal";


const Welcome = () => {
    const [loginIsOpen, setLoginIsOpen] = useState(false);

    useEffect(() => {
        Modal.setAppElement("#main");
    })
    
    return <>
    <img src="/image/page/welcome.png" className="welcomeImage" />
    <div className="welcome">
        <div className="logo">
            <div>The Reader</div>
        </div>
        <div className="subLogo">
            Today's reader Tomorrow's leader
        </div>
        <div className="button">
            <div onClick={e => location.href = '/user/page/login?nav=2'} className="register">회원가입</div>
            <div onClick={e => location.href = '/user/page/login'} className="login">로그인</div>
        </div>
    </div>
    </>
}

ReactDOM.render(<Welcome/>, document.querySelector('#main'));