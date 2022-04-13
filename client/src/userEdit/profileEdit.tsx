import axios from 'axios';
import React, { useEffect, useState } from 'react';
import jwtInterceptor from '../modules/ts/jwtInterceptor';
const ProfileEdit = () => {
    const userID = document.querySelector('#main')?.getAttribute('userID');
    const [nickname, setNickname] = useState('');
    const [message, setMessage] = useState('');
    const [acceptMail, setAcceptMail] = useState(0);

    useEffect(() => {
        jwtInterceptor.get(`/user/${userID}`).then(res => {
            setNickname(res.data.nickname);
            setMessage(res.data.message);
            setAcceptMail(res.data.acceptMail);
            const rejectMail = document.querySelector("#rejectMail");
            const acceptMail = document.querySelector("#acceptMail");
            if(res.data.acceptMail === 0 && rejectMail !== null){
                rejectMail["checked"] = true;
            } else if(acceptMail !== null){
                acceptMail["checked"] = true;
            }
        })
    }, []);

    const onClickSubmit = e => {
        e.preventDefault();
        jwtInterceptor.put("/user", {nickname, message, acceptMail}).then(res => {
            if(res.status < 300){
                alert("성공적으로 변경되었습니다.");
            } else{
                alert(res.data.message);
            }
            location.reload();
        })
    }

    return <>
        <label>닉네임: <br />
            <input type="text" value = {nickname} onChange={e => setNickname(e.target.value)}/>
        </label><br/>
        <label>상태 메시지: <br/>
            <input type="text" value = {message} onChange={e => setMessage(e.target.value)}/>
        </label><br/>
        <label>메일 승인 여부: <br/>
            <input type="radio" name="acceptMail" id="acceptMail"
            onChange={e => setAcceptMail(1)}/>승인
            <input type="radio" name="acceptMail" id="rejectMail"
            onChange={e => setAcceptMail(0)}/>거절
        </label><br/>
        <input type="submit" onClick={e => onClickSubmit(e)} value="정보 변경하기" />
    </>
}

export default React.memo(ProfileEdit);