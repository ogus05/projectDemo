import React, { useEffect, useState } from 'react';
import passwordEncryptor from '../modules/ts/passwordEncryptor';
import axios from 'axios';

const PasswordEdit = (props) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const setPasswordsToEmpty = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }

    const onSubmitEditPassword = e => {
        e.preventDefault();
        console.log(props);
        if(newPassword !== confirmPassword){
            alert("비밀번호 확인이 같지 않습니다.");
            setPasswordsToEmpty();
        } else{
            axios.put("/user/password", {
                ID: props.ID,
                currentPassword: passwordEncryptor(currentPassword, props.ID),
                newPassword: passwordEncryptor(newPassword, props.ID)
            }).then(res => {
                    axios.delete("/auth").then(res2 => {
                        alert("비밀번호가 성공적으로 변경되었습니다. 재 로그인 후 사용 가능합니다.");
                        location.href = '/';
                    }).catch(err => {
                        alert("비밀번호가 성공적으로 변경되었습니다. 재 로그인 후 사용 가능합니다.");
                        location.href = '/';
                    })
            }).catch(err => {
                alert(err.response.data.message);
                setPasswordsToEmpty();
            })
        }
    }

    return <>
        <form onSubmit={e => onSubmitEditPassword(e)}>
            <label>현재 비밀번호: <br />
                <input type="password" value = {currentPassword} onChange={e => setCurrentPassword(e.target.value)}/>
            </label><br/>
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

export default React.memo(PasswordEdit)
