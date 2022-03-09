import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Header from '../modules/header.logined';
import ProfileEdit from './profileEdit';

const UserEdit = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return <>
        <Header/>
        <h1>닉네임 / 비밀번호 수정</h1>
        <form>
            <label>비밀번호: <br/>
                <input type="password" value = {password} onChange={e => setPassword(e.target.value)}/>
            </label><br/>
            <label>비밀번호 확인: <br/>
                <input type="password" value = {confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </label><br/>
            <input type="submit" value="비밀번호 변경하기" />
        </form>
        <ProfileEdit />
        <button onClick={e => location.href = '/user/page/cancle'}>회원 탈퇴하기</button>
    </>
}

ReactDOM.render(<UserEdit/>, document.querySelector("#main"));
