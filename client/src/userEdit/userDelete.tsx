import axios from 'axios';
import React from 'react';
import jwtInterceptor from '../modules/ts/jwtInterceptor';

const userDelete = () => {
    const onClickButton = e => {
        e.preventDefault();
        jwtInterceptor.delete('/user').then(res => {
            if(res.status < 300){
                alert("성공적으로 회원탈퇴 되었습니다. 감사합니다.");
                location.href = '/'
            } else{
                alert(res.data.message);
            }
        });
    }
    return <>
        <button onClick={e => onClickButton(e)}>회원 탈퇴하기</button>
    </>
}

export default React.memo(userDelete);