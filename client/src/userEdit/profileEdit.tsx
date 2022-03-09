import axios from 'axios';
import React, { useEffect, useState } from 'react';
const ProfileEdit = () => {
    const userID = document.querySelector('#main')?.getAttribute('userID');
    const [profile, setProfile] = useState({
        phone: '', email: '', message: ''
    });
    const [openForm, setOpenForm] = useState({
        phone: false, email: false, message: false
    });

    const onClickOpen = e => {
        e.preventDefault();
        const newOpenForm = openForm;
        newOpenForm[e.target.value] = !newOpenForm[e.target.value];
        setOpenForm({
            ...newOpenForm
        });
    }
    useEffect(() => {
        axios.get('/user/profile').then(res => {
            setProfile({
                phone: res.data.phone,
                email: res.data.email,
                message: res.data.message,
            });
        })
    }, [])
    return <>
        <h1>프로필 수정</h1>
        <form>
            <label>휴대폰 번호: 
                {profile.phone}<br/>
                <button value="phone" onClick={onClickOpen}>
                    {openForm.phone ? "닫기" : "수정하기"}
                </button><br/>
                {!openForm.phone ? null: <>
            
                </>}
            </label><br/>
            <label>이메일: 
                {profile.email}<br/>
                <button value="email" onClick={onClickOpen}>
                    {openForm.email ? "닫기" : "수정하기"}
                </button><br/>
                {openForm.email ? <input type="text"/> : null}
            </label><br/>
            <label>상태 메시지: 
                {profile.message}<br/>
                <button value="message" onClick={onClickOpen}>
                    {openForm.message ? "닫기" : "수정하기"}
                </button><br/>
                {openForm.message ? <input type="text"/> : null}
            </label><br/>
        </form>
    </>
}

export default React.memo(ProfileEdit);