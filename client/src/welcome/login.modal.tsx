import axios from 'axios';
import React, { useState } from 'react'
import Modal from 'react-modal';
import passwordEncryptor from '../modules/ts/passwordEncryptor';
import './scss/login.modal.scss'

export const LoginModal = ({isOpen, onRequestClose}) => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');

    const submitLogin = e => {
        e.preventDefault();
        setPassword(passwordEncryptor(password));
        axios.post('/auth', {userID, password},{
            validateStatus: status => status<500,
        })
        .then(res => {
            if(res.status === 201){
                location.href = '/';
            } else{
                alert(res.data.message);
                setPassword('');
            }
        }).catch(err => {
            console.log(err);
            alert("잠시 후 다시 시도해주세요.");
            location.href = '/';
        })
    }

    return <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="loginmodal">
        <form onSubmit = {submitLogin}>
            <label>
                아이디:<br/>
                <input type="text" value={userID} onChange={e => setUserID(e.target.value)}/><br/>
            </label>
            <label>
                비밀번호:<br/>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
            </label><br/>
            <label>
                <input type="submit" value="로그인" />
            </label>
        </form>
    </Modal>
}