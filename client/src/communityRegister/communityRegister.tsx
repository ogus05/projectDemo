import axios from 'axios';
import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import { ICommunityRegister } from '../interfaces/community.i';
import Footer from '../modules/footer';
import Header from '../modules/header.logined';
import { Logo } from '../modules/logo';
import './scss/communityRegister.scss';

const CommunityRegister = () => {
    const [community, setCommunity] = useState<ICommunityRegister>({
        name: "", isOpen: 0, message: ""
    });

    const onClickIsOpen = e => {
        e.preventDefault();
        if(e.target.parentNode.className === "true" || e.target.className === "true"){
            setCommunity({
                ...community,
                isOpen: 1,
            })
        }
        else if(e.target.parentNode.className === "false" || e.target.className === "false"){
            setCommunity({
                ...community,
                isOpen: 0,
            })
        }
    }

    const onClickCommunityMark = e => {
        e.preventDefault();
    }

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
        <article>
            <Logo/>
            <div className="title">
                커뮤니티 만들기
            </div>
            <div className="form">
                    <div className="left">
                        <p>커뮤니티 이름</p>
                            <input className="communityName" type="text" value={community.name} onChange={e => setCommunity({
                                ...community,
                                name: e.target.value
                            })}/>
                        <p>커뮤니티 소개 </p>
                            <input className="communityMessage" type="text" value={community.message} onChange={e => setCommunity({
                                ...community,
                                message: e.target.value,
                            })}/>
                        <p>커뮤니티 마크</p>
                        <img className="communityMark" src="/image/upload_file.png" onClick={e => onClickCommunityMark(e)}/>
                    </div>
                    <div className="right">
                        <p>커뮤니티 공개</p>
                            <div className="communityIsOpen">
                                <div className="false" onClick={e => onClickIsOpen(e)}>
                                    <img src={(community.isOpen === 0) ? "/image/checked_ring.png" : "/image/unchecked_ring.png"}></img>
                                    <div>비공개</div>
                                    <div></div>
                                    <div className="explanation">게시글이 공개되지 않습니다.<br/>
                                    초대를 통해서만 가입 가능합니다.</div>
                                </div>
                                <div className="true" onClick={e=>onClickIsOpen(e)}>
                                    <img src={(community.isOpen === 1) ? "/image/checked_ring.png" : "/image/unchecked_ring.png"}></img>
                                    <div>공개</div>
                                    <div></div>
                                    <div className="explanation">누구나 검색해 찾을 수 있고,
                                    소개와 게시물을 볼 수 있습니다.</div>
                                </div>
                            </div>
                    </div>
                    <div className="button">
                            <div className="cancle" onClick={ e => location.href = '/'}>취소</div>
                            <div className="confirm" onClick={e => onSubmitCommunity(e)}>완료</div>
                    </div>
            </div>
        </article>
        <Footer/>
    </>
}


ReactDOM.render(<CommunityRegister/>, document.querySelector('#main'));