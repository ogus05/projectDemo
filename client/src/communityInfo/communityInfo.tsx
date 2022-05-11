import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ICommunityInfo } from '../interfaces/community.i';
import { IUser } from '../interfaces/user.i';
import Header from '../modules/header.logined';
import { ReviewList } from '../modules/reviewList';

const CommunityInfo = () => {
    const [user, setUser] = useState<IUser>({
        number: 1, nickname: '', communityID: 1, role: 0
    });
    const [communityInfo, setCommunityInfo] = useState<ICommunityInfo>({
        leaderNumber: 1, image: '', message: '', regDate: '',
    })
    const communityID = parseInt(document.querySelector('#main')?.getAttribute('communityID') as string, 10);
    
    const onClickApplyCommunity = e => {
        e.preventDefault();
        if(confirm("가입 신청 시 이전에 가입 신청들이 사라질 수 있습니다.")){
            axios.post('/community/apply', {
                ID: communityID,
            }).then(res => {
                alert("성공적으로 신청이 완료되었습니다.")
            }).catch(err => {
                alert(err.response.data.message);
            })
        } else{
            location.reload();
        }
    }

    useEffect(() => {
        axios.get(`/community/info/${communityID}`).then(res => {
            setCommunityInfo({
                ...communityInfo,
                ...res.data
            });
        });
        axios.get(`/user`).then(res => {
            setUser({
                ...user,
                ...res.data
            });
        });
    }, [])
    
    return <>
        <Header />
        <>
            {(user.number === communityInfo.leaderNumber) ? 
            <button onClick={() => location.href = '/community/page/edit'}>커뮤니티 수정</button> : null}
            {(user.communityID === communityID) ? <button>글쓰기</button> : 
            (user.communityID === 1) ?
            <button onClick={e => onClickApplyCommunity(e)}>가입 신청하기</button> : null}
            <h1>소속 커뮤니티 인기 리뷰</h1>
            <ReviewList url='/'/>
            <h1>소속 커뮤니티 최신 리뷰</h1>
            <ReviewList url='/'/>
            <h1>최근 본 리뷰</h1>
            <ReviewList url='/'/>
        </>
    </>
}


ReactDOM.render(<CommunityInfo/>, document.querySelector('#main'));
