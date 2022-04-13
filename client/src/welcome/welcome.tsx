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

    const clickLogin = e => {
        setLoginIsOpen(true);
    }
    
    const clickRegister = e => {
        location.href = '/user/page/register';
    }

    return <>
    <div id="welcome">
    <h1>The Reader</h1>
        <span onClick={e => clickRegister(e)}>Register</span>
        &nbsp;/&nbsp;
        <span onClick={e => clickLogin(e)}>Login</span>
    </div>
    <LoginModal isOpen={loginIsOpen} onRequestClose={() => setLoginIsOpen(false)}></LoginModal>
    </>
}

ReactDOM.render(<Welcome/>, document.querySelector('#main'));