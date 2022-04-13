import axios from 'axios';
import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import Header from '../modules/header.logined';
import jwtInterceptor from '../modules/ts/jwtInterceptor';

const CommunityRegister = () => {
    const [name, setName] = useState('');
    const [isOpen, setIsOpen] = useState(1);
    const [message, setMessage] = useState('');
    const onSubmitCommunity = e => {
        e.preventDefault();
        axios.post('/community', {
            name, isOpen, message
        }).then(res => {
            alert('커뮤니티가 성공적으로 만들어졌습니다.');
            location.href = "/";
        }).catch(err =>{
            alert(err.response.data.message);
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
                <select value={isOpen} onChange={e => setIsOpen(e.target.value === "true" ? 1 : 0)}>
                    <option value="true">공개</option>
                    <option value="false">비공개</option>
                </select>
            </label><br/>
            <label>커뮤니티 소개: <br/>
                <input type="text" value={message} onChange={e => setMessage(e.target.value)}/>
            </label><br/>
            <input type="submit" value="만들기" />
        </form>
    </>
}


ReactDOM.render(<CommunityRegister/>, document.querySelector('#main'));