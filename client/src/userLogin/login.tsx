import axios from "axios";
import { useState } from "react";
import passwordEncryptor from "../modules/ts/passwordEncryptor";
import './scss/login.scss';
export const Login = () => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [loginAlert, setLoginAlert] = useState('');
    const submitLogin = e => {
        e.preventDefault();
        axios.post('/auth', {userID, password: passwordEncryptor(password, userID)})
        .then(res => {
            location.href = '/';
        }).catch(err => {
            setLoginAlert(err.response.data.message);
            setPassword('');
        })
    }

    const submitFindPassword = e => {
        e.preventDefault();
        axios.post('/user/confirm?type=1', {userID})
        .then(res => {
            alert("이메일이 발신되었습니다. 메일함을 확인 해 주세요.");
            location.reload();
        }).catch(err => {
            alert(err.response.data.message);
            setUserID('');
        })
    }
    return <div className="login">
        <div className="image">
            <img src ="/image/logo.png" />
        </div>
        <form onSubmit={e => submitLogin(e)}>
            <div className="userIdBlock">
                <div>이메일</div>
                <input type="text" placeholder="이메일을 입력 해 주세요." autoComplete="off"
                value={userID} onChange={e => setUserID(e.target.value)}/>
            </div>
            <div className="passwordBlock">
                <div>비밀번호</div>
                <input type="password" placeholder="비밀번호를 입력 해 주세요." autoComplete="off"
                value = {password}onChange={e => setPassword(e.target.value)}/>
                <div className="alert">{loginAlert}</div>
            </div>
            <input type="submit" className="submitBlock" value="로그인" />
        </form>
    </div>
}