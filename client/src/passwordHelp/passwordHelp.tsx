import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import {Header} from '../modules/header.unlogined';
import passwordEncryptor from '../modules/ts/passwordEncryptor';
import axios from 'axios';

const PasswordEdit = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const token = new URLSearchParams(location.search).get("token");

    const setPasswordsToEmpty = () => {
        setNewPassword('');
        setConfirmPassword('');
    }

    const onSubmitEditPassword = e => {
        e.preventDefault();
        if(newPassword !== confirmPassword){
            alert("비밀번호 확인이 같지 않습니다.");
            setPasswordsToEmpty();
        }else{
            axios.get(`/user/token/${token}`).then(res => {
                axios.patch("/user/password", {
                    ID: res.data.userID,
                    currentPassword: 'fjieowf123',
                    newPassword: passwordEncryptor(newPassword, res.data.userID)
                }).then(res => {
                    axios.delete("/auth").then(res => {
                        alert("비밀번호가 성공적으로 변경되었습니다. 재 로그인 후 사용 가능합니다.");
                        location.href = '/';
                    })
                }).catch(err => {
                    alert(err.response.data.message);
                    setPasswordsToEmpty();
                })
            })
        
        }
    }

    return <>
        <Header/>
        <h1>비밀번호 수정</h1>
        <form onSubmit={e => onSubmitEditPassword(e)}>
            <label>비밀번호: <br/>
                <input type="password" value = {newPassword} onChange={e => setNewPassword(e.target.value)}/>
            </label><br/>
            <label>비밀번호 확인: <br/>
                <input type="password" value = {confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </label><br/>
            <input type="submit" value="비밀번호 변경하기" />
        </form>
    </>
}

ReactDOM.render(<PasswordEdit/>, document.querySelector("#main"));
