import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom'
import Footer from '../modules/footer';
import Header from '../modules/header.logined';
import { ReviewList } from '../modules/reviewList';

import "./scss/userInfo.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import { MyReviewList } from './myReviewList';
import { MyCommentList } from './myCommentList';
import { Logo } from '../modules/logo';
const UserInfo = () => {
    const [nav, setNav] = useState(0);
    const [user, setUser] = useState({
        nickname: "",
        community: {
            name: "",
        },
        message: "",
        regDate: "",
    });
    const [userNumber, setUserNumber] = useState<number>(parseInt(document.querySelector("#main")!.getAttribute("number") as string));
    useEffect(() => {
        axios.get(`/user/info/${userNumber}`).then(res => {
            const regDate = new Date(res.data.regDate);
            setUser({
                ...res.data,
                regDate : `${regDate.getFullYear()}년 ${("00" + (regDate.getMonth() + 1)).slice(-2)}월 ${("00" + regDate.getDate()).slice(-2)}일`,
            });
        });
    }, [])
    const onErrorImage = e => {
        e.target.setAttribute('src', '/image/user/default');
    }
    return <>
        <Header />
        <article>
            <Logo/>
            <div className="user">
                <div className="userImage">
                    <div className="block">
                        <img src={`/image/user/${userNumber}`} onError={e => onErrorImage(e)} />
                        {/* <div className="userImageEdit">
                            <FontAwesomeIcon icon={faPlus} />
                        </div> */}
                    </div>
                </div>
                <div className="userInfo">
                    <p className='communityName'>
                        {user.community.name}
                    </p>
                    <p className="userNickname">
                        {user.nickname}
                    </p>
                </div>
                    <div className="userMessage">
                        {(user.message) ? user.message : "아직 자기소개가 작성되지 않았습니다."}
                    </div>
                <div className="userEdit">
                    <button onClick={e => (location.href = "/user/page/edit")}>개인정보 수정하기</button>
                </div>
                <div className="regDate">
                    가입일: {user.regDate}
                </div>
            </div>
            <div className="userNav">
                <div className="title" onClick={e => setNav(0)} id ={nav !== 0 ? "unChecked" : undefined}>
                    내가 쓴 북 리뷰
                </div>
                <div className="title" onClick={e => setNav(1)} id ={nav !== 1 ? "unChecked" : undefined}>
                    내 댓글
                </div>
            </div>
            <div className="card">
                {nav === 0 ? <MyReviewList userNumber={userNumber}/> : <MyCommentList userNumber={userNumber}/>}
            </div>
        </article>
        <Footer/>
    </>
}

ReactDOM.render(<UserInfo/>, document.querySelector("#main"));
