import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from '../modules/header.logined';
import Modal from "react-modal";
import axios from 'axios';
import { ICommunityEdit } from '../interfaces/community.i';
import Footer from '../modules/footer';
import './scss/communityEdit.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Logo } from '../modules/logo';

const CommunityEdit = () => {
    const [community, setCommunity] = useState<ICommunityEdit>({
        name: '', message: '', isOpen: 0, ID: 0,
    });
    const [image, setImage] = useState<FileList | null>(null);
    const [imageBase64, setImageBase64] = useState<string>('');
    useEffect(() => {
        axios.get('/community/edit').then(res => {
            setCommunity({
                ...community,
                ...res.data,
            });
            axios.get(`/community/image/${res.data.ID}`).then(res => {
                let reader = new FileReader();
                reader.readAsDataURL(res.data);
                reader.onloadend = () => {
                    const base64 = reader.result;
                    if (base64) {
                        setImageBase64(base64.toString());
                    }
                }
            })
        })
        Modal.setAppElement("#main");
        
    }, []);
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

    const onClickSubmit = e => {
        e.preventDefault();
        axios.put(`/community`, {
            name: community.name, isOpen: community.isOpen, message: community.message,
        }).then(res => {
            if(image !== null){
                const fd = new FormData();
                Object.values(image).forEach(file => fd.append("image", file));
                axios.put('/community/image', fd, {
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    }
                }).then(res => {
                    location.reload();
                }).catch(e => {
                    alert(e.response.data.message);
                })
            } else{
                location.reload();
            }
        }).catch(e => {
            alert(e.response.data.message);
            location.reload();
        })
    }
    const handleChangeFile = e => {
        e.preventDefault();
        setImage(e.target.files);
        if (e.target.files[0]) {
          let reader = new FileReader();
          reader.readAsDataURL(e.target.files[0]);
          reader.onloadend = () => {
            const base64 = reader.result;
            if (base64) {
                setImageBase64(base64.toString());
            }
        }
      }
    }
    return <>
        <Header/>
            <article>
                <Logo/>
                <div className="title">
                    커뮤니티 수정
                </div>
                <div className="form">
                    <div className="left">
                        <p>커뮤니티 이름</p>
                            <input className="communityName" type="text" value={community.name} onChange={e => setCommunity({
                                ...community,
                                name: e.target.value
                            })}/>
                        <p>커뮤니티 소개 </p>
                            <textarea className="communityMessage" value={community.message} onChange={e => setCommunity({
                                ...community,
                                message: e.target.value,
                            })}/>
                        <p>커뮤니티 마크</p>
                        <label className="communityMark" htmlFor="image">
                            {
                                imageBase64 !== '' ? <img src={imageBase64}/>:
                                <img src={`/image/community/${community.ID}`} onError={(e: any) => e.target.setAttribute('src', '/image/community/default')}/>
                            }
                            <div className="markUploadFont">
                                <FontAwesomeIcon icon={faArrowUpFromBracket}/>
                            </div>
                        </label>
                        <input type="file" id="image" accept="image/*" onChange={handleChangeFile} style={{display: "none"}} />
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
                            <div className="confirm" onClick={e => onClickSubmit(e)}>완료</div>
                    </div>
            </div>
            </article>
        <Footer/>
    </>
}

ReactDOM.render(<CommunityEdit/>, document.querySelector("#main"));