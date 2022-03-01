import React, { useState } from 'react'
import Modal from 'react-modal';
import './scss/login.modal.scss'

export const LoginModal = ({isOpen, onRequestClose}) => {
    const [userID, setUserID] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const submitLogin = e => {
        e.preventDefault();
        //로그인 구현
        location.href = '/main';
    }

    return <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="loginmodal">
        <form onSubmit = {submitLogin}>
            <label>
                아이디:<br/>
                <input type="text" value={userID} onChange={e => setUserID(e.target.value)}/><br/>
            </label>
            <label>
                비밀번호:<br/>
                <input type="password" value={userPassword} onChange={e => setUserPassword(e.target.value)} /><br/>
            </label><br/>
            <label>
                <input type="submit" value="로그인" />
            </label>

        </form>
    </Modal>
}