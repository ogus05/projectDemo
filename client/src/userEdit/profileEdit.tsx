import axios from 'axios';
import React from 'react';
import { IUserEdit } from '../interfaces/user.i';
const ProfileEdit = ({user, setUser}: {user: IUserEdit, setUser: any}) => {


    const onClickSubmit = e => {
        e.preventDefault();
        axios.put("/user", {nickname: user.nickname, message: user.message
            , acceptMail: user.acceptMail}).then(res => {
            alert("성공적으로 변경되었습니다.");
        }).catch(err => {
            alert(err.response.data.message);
            location.reload();
        }).finally(() => {
            location.reload();
        })
    }

    return <>
        <label>닉네임: <br />
            <input type="text" value = {user.nickname} onChange={e => setUser({
                ...user,
                nickname: e.target.value
            })}/>
        </label><br/>
        <label>상태 메시지: <br/>
            <input type="text" value = {user.message} onChange={e => setUser({
                ...user,
                message: e.target.value
            })}/>
        </label><br/>
        <label>메일 승인 여부: <br/>
            <input type="radio" name="acceptMail" id="acceptMail"
            onChange={e => setUser({
                ...user,
                acceptMail: true,
            })}/>승인
            <input type="radio" name="acceptMail" id="rejectMail"
            onChange={e => setUser({
                ...user,
                acceptMail: false,
            })}/>거절
        </label><br/>
        <input type="submit" onClick={e => onClickSubmit(e)} value = "정보 변경하기" />
    </>
}

export default React.memo(ProfileEdit);