import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom'
import Header from '../modules/header.logined';
import { BmReview } from './bmReview';
import { MyComment } from './myComment';
import "./scss/userInfo.scss";
import { WriteReview } from './writeReview';
const UserInfo = () => {
    const [nav, setNav] = useState(0);
    const [user, setUser] = useState({
        nickname: ""
    })
    useEffect(() => {
        axios.get(`/user/info/${document.querySelector("#main")?.getAttribute("number")}`).then(res => {
            setUser({
                ...res.data
            });
        })
    }, [])
    return <>
        <Header />
        <div id="user">
            <div>{user.nickname}님 안녕하세요!</div>
            <button onClick={e => (location.href = "/user/page/edit")}>개인정보 수정하기</button>
            <div>가입 커뮤니티 정보 확인</div>
        </div>
        <nav>
            <div onClick={e => setNav(0)}>
                <p>내가 쓴 북 리뷰</p>
            </div>
            <div onClick={e => setNav(1)}>
                <p>내 댓글</p>
            </div>
            <div onClick={e => setNav(2)}>
                <p>북마크한 리뷰</p>
            </div>
        </nav>
        {new Array(<WriteReview/>,<MyComment/>, <BmReview/>)[nav]}
    </>
}

ReactDOM.render(<UserInfo/>, document.querySelector("#main"));
