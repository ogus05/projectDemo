import axios from 'axios';
import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import Header from '../modules/header.logined';
import jwtInterceptor from '../modules/ts/jwtInterceptor';

const CommunityRegister = () => {
    const [name, setName] = useState('');
    const [isOpen, setIsOpen] = useState("false");
    const [mark, setMark] = useState('');
    const [message, setMessage] = useState('');
    const onSubmitCommunity = e => {
        e.preventDefault();
        jwtInterceptor.post('/community', {
            name, isOpen: isOpen === "true", mark, message
        }).then(res => {
            if(res.status < 400){

                alert('커뮤니티가 성공적으로 만들어졌습니다.');
                location.reload();
            } else{
                alert(res.data.message);
                location.reload();
            }
        }).catch(e =>{
            alert(e.message);
            location.reload();
        })
    }
    return<>
        <Header/>
        <form onSubmit={e => onSubmitCommunity(e)}>
            <label>커뮤니티 이름: <br/>
                <input type="text" value={name} onChange={e => setName(e.target.value)}/>
            </label><br/>
            <label>공개/비공개 여부: <br/>
                <select value={isOpen} onChange={e => setIsOpen(e.target.value)}>
                    <option value="true">공개</option>
                    <option value="false">비공개</option>
                </select>
            </label><br/>
            <label>커뮤니티 마크: <br/>
                <input type="file" accept="image/png, image/jpeg"
                value={mark} onChange={e => setMark(e.target.value)}/>
            </label><br/>
            <label>커뮤니티 소개: <br/>
                <input type="text" value={message} onChange={e => setMessage(e.target.value)}/>
            </label><br/>
            <input type="submit" value="만들기" />
        </form>
    </>
}


ReactDOM.render(<CommunityRegister/>, document.querySelector('#main'));