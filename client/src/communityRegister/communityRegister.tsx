import axios from 'axios';
import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import { ICommunityRegister } from '../interfaces/community.i';
import Header from '../modules/header.logined';

const CommunityRegister = () => {
    const [community, setCommunity] = useState<ICommunityRegister>({
        name: "", isOpen: 0, message: ""
    });
    const onSubmitCommunity = e => {
        e.preventDefault();
        axios.post('/community', {
            ...community
        }).then(res => {
            alert('커뮤니티가 성공적으로 만들어졌습니다.');
            location.href = "/";
        }).catch(err =>{
            alert(err.response.data.message);
            location.reload();
        })
    }
    return <>
        <Header/>
        <form onSubmit={e => onSubmitCommunity(e)}>
            <label>커뮤니티 이름: <br/>
                <input type="text" value={community.name} onChange={e => setCommunity({
                    ...community,
                    name: e.target.value
                })}/>
            </label><br/>
            <label>공개/비공개 여부: <br/>
                <input type="radio" name="isOpen" onChange={e => setCommunity({
                    ...community,
                    isOpen: 1,
                })}/>공개
                <input type="radio" name="isOpen" checked onChange={e => setCommunity({
                    ...community,
                    isOpen: 0,
                })}/>비공개
            </label><br/>
            <label>커뮤니티 소개: <br/>
                <input type="text" value={community.message} onChange={e => setCommunity({
                    ...community,
                    message: e.target.value,
                })}/>
            </label><br/>
            <input type="submit" value="만들기" />
        </form>
    </>
}


ReactDOM.render(<CommunityRegister/>, document.querySelector('#main'));