import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from '../modules/header.logined';
import ProfileEdit from './profileEdit';
import passwordEncryptor from '../modules/ts/passwordEncryptor';
import axios from 'axios';
import UserDelete from './userDelete';
import { IUserEdit } from '../interfaces/user.i';
import PasswordEdit from './passwordEdit';

const UserEdit = () => {
    const [user, setUser] = useState<IUserEdit>({
        ID: '', nickname: '', message: '', phone: '', birth: ''
        , male: false, acceptMail: false, communityID: 1, role: 0
    });

    useEffect(() => {
        axios.get(`/user/edit`).then(res => {
            setUser(res.data);
            const rejectMail = document.querySelector("#rejectMail");
            const acceptMail = document.querySelector("#acceptMail");
            if(res.data.acceptMail === 0 && rejectMail !== null){
                rejectMail["checked"] = true;
            } else if(acceptMail !== null){
                acceptMail["checked"] = true;
            }
        })
    }, []);

    return <>
        <Header/>
        <h1>닉네임 / 비밀번호 수정</h1>
        <PasswordEdit {...{ID: user.ID}}/>
        <ProfileEdit {...{user, setUser}}/><br />
        <UserDelete />
    </>
}

ReactDOM.render(<UserEdit/>, document.querySelector("#main"));
