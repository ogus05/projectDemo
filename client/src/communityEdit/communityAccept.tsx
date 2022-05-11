import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ICommunityApply } from '../interfaces/community.i';

const UserApplyInfo = (user: ICommunityApply, key: number) => {
    
    const onClickAccept = e => {
        e.preventDefault();
        axios.post('/community/user',{number: user.number}).then(res => {
            
        });
    }

    const onClickReject = e => {
        e.preventDefault();
        axios.delete('/community/apply', {
            data: {number: user.number}
        }).then(res => {

        });
    }


    return <>
        <p>{user.nickname}</p>
        <button onClick={e => onClickAccept(e)}>승인</button>
        <button onClick={e => onClickReject(e)}>거절</button>
    </>
}

export const CommunityAccept = () => {
    const [user, setUser] = useState<ICommunityApply[]>([]);
    useEffect(() => {
        axios.get('/community/apply').then(res => {
            setUser(res.data);
        });
    }, []);
    return <>
    {
        (user.length === 0) ? <p>커뮤니티 등록을 요청한 유저가 존재하지 않습니다.</p> :
        <>{
        user.map(user => 
            <UserApplyInfo nickname={user.nickname} number={user.number} key={user.number}/>
        )
        }</>
    }
    </>
}