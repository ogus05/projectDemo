import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from '../modules/header.logined';
import Modal from "react-modal";
import axios from 'axios';
import { CheckLeader } from '../modules/ts/checkLeader';

const CommunityEdit = () => {
    const [isOpen, setIsOpen] = useState(0);
    const [message, setMessage] = useState('');
    
    const [delegateModalIsOpen, setDelegateModalIsOpen] = useState(false);
    const [delegatedUser, setDelegatedUser] = useState('');

    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    useEffect(() => {
        CheckLeader().then(communityID => {
            axios.get(`/community/${communityID}`).then(res => {
                const isOpenTrue = document.querySelector("#isOpenTrue");
                const isOpenFalse = document.querySelector("#isOpenFalse");
                setIsOpen(res.data.isOpen);
                setMessage(res.data.message);
                if(res.data.isOpen === 1 && isOpenTrue){
                    isOpenTrue["checked"] = true;
                } else if (isOpenFalse){
                    isOpenFalse["checked"] = true;
                }
            }).catch(err => {
                alert(err.response.data.message);
                location.href = '/';
            })
        });
        Modal.setAppElement("#main");
        
    }, []);

    const delegateLeader = e => {
        e.preventDefault();
        axios.get(`/user/${delegatedUser}`).then(res => {
            if(confirm(`${res.data.nickname}님에게 리더 권한을 임명하겠습니까?`)){
                axios.put(`/community/leader`, {userID: delegatedUser}).then(res => {
                    alert("성공적으로 리더가 변경되었습니다.");
                    location.href = '/community';
                }).catch(err => {
                    alert(err.response.data.message);
                    setDelegatedUser('');
                })
            }
        }).catch(err => {
            alert(err.response.data.message);
            setDelegatedUser('');
        })
        
    }

    const onClickSubmit = e => {
        axios.put(`/community`, {
            isOpen, message
        }).then(res => {
            alert("성공적으로 변경되었습니다.");
        }).catch(err => {
            alert(err.response.data.message);
        })
        location.reload();
    }

    const onClickDelete = e => {
        axios.delete(`/community`).then(res => {
            alert("커뮤니티가 삭제되었습니다.");
            location.href = '/';
        }).catch(err => {
            alert(err.response.data.message);
            location.reload();
        })
    }

    return <>
        <Header/>
        <h1>커뮤니티 정보 수정</h1>
        <button onClick={e => setDelegateModalIsOpen(true)}>리더 권한 위임하기</button><br/>
        <label>공개 여부 : <br />
            <input type="radio" name="isOpen" id="isOpenTrue" onChange={e => setIsOpen(1)} />공개
            <input type="radio" name="isOpen" id="isOpenFalse" onChange={e => setIsOpen(0)}/>비공개
        </label><br/>
        <label>커뮤니티 메시지 : <br/>
            <input type="text" value={message} onChange = {e => setMessage(e.target.value)}/>
        </label><br/>
        <button onClick={e => onClickSubmit(e)}>정보 변경하기</button><br/>
        <button onClick={e => setDeleteModalIsOpen(true)}>커뮤니티 삭제하기</button><br/>
        <Modal isOpen = {delegateModalIsOpen} onRequestClose={() => setDelegateModalIsOpen(false)}
            className="delegateModal">
            <h3>리더 권한 위임하기</h3>
            <p>커뮤니티 유저의 아이디를 입력해주세요.</p>
            <input type="text" value={delegatedUser}onChange={e => setDelegatedUser(e.target.value)}/><br/>
            <button onClick={e => delegateLeader(e)}>위임하기</button><br/>
            <button onClick={e => setDelegateModalIsOpen(false)}>닫기</button>
        </Modal>
        <Modal isOpen = {deleteModalIsOpen} onRequestClose={() => setDeleteModalIsOpen(false)}
            className="deleteModal">
            <h3>커뮤니티 삭제하기</h3>
            <p>정말 삭제하겠습니까??</p>
            <button onClick={e => onClickDelete(e)}>삭제하기</button><br/>
            <button onClick={e => setDeleteModalIsOpen(false)}>취소</button>
        </Modal>
    </>
}

ReactDOM.render(<CommunityEdit/>, document.querySelector("#main"));