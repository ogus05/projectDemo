import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { IUser } from '../interfaces/user.i';
import Header from '../modules/header.logined';

const CommunitySearch = () => {
    const [user, setUser] = useState<IUser>({
        communityID: 0, nickname: '', number: 0, role: 0,
    });
    useEffect(() => {
        axios.get('/user').then(res => {
            setUser({
                ...user,
                ...res.data,
            })
        })
    }, [])

    return <>
        <Header />
        <h2>커뮤니티 찾기</h2>
        {(user.communityID === 1) ? 
        <button onClick={() => location.href = '/community/page/register'}>커뮤니티 만들기</button> : null}
    </>
}

ReactDOM.render(<CommunitySearch />, document.querySelector('#main'));