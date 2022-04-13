import axios from 'axios';
import React, { useState } from 'react'
import Modal from 'react-modal';
import passwordEncryptor from '../modules/ts/passwordEncryptor';
import './scss/login.modal.scss'

export const LoginModal = ({isOpen, onRequestClose}) => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [findPassword, setFindPassword] = useState(false);

    const submitLogin = e => {
        e.preventDefault();
        axios.post('/auth', {userID, password: passwordEncryptor(password, userID)})
        .then(res => {
            location.href = '/';
        }).catch(err => {
            alert(err.response.data.message);
            setPassword('');
        })
    }

    const submitFindPassword = e => {
        e.preventDefault();
        axios.post('/user/confirm?type=1', {userID})
        .then(res => {
            alert("이메일을 확인해 주세요.");
            location.reload();
        }).catch(err => {
            alert(err.response.data.message);
            setUserID('');
        })
    }

    return <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="loginmodal">
        {
            findPassword ?
            <div>
                <form onSubmit = {submitFindPassword}>
                    <label>
                        아이디:<br/>
                        <input type="text" value={userID} onChange={e => setUserID(e.target.value)}/><br/>
                    </label>
                    <input type="submit" value="비밀번호 확인" />
                </form>
                <button onClick={e => setFindPassword(false)}>로그인</button>
            </div>            
            :
            <div>
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
                <button onClick={e => setFindPassword(true)}>비밀번호 찾기</button>
            </div>
            

        }
    </Modal>
}