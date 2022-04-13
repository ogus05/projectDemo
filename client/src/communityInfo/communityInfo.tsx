import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from '../modules/header.logined';
import { UserInfo } from '../modules/interfaces';
import { ReviewList } from '../modules/reviewList';
import { UnloginedCommunityInfo } from './unloginedCommunityInfo';

const CommunityInfo = () => {
    const [userInfo, setUserInfo] = useState({
        communityID: 1,
        leader: false,
    });
    let communityID = parseInt(document.querySelector('#main')?.getAttribute('communityID') as string, 10);
    const onClickApplyCommunity = e => {
        e.preventDefault();
        if(confirm("가입 신청 시 이전에 가입 신청들이 사라질 수 있습니다.")){
            axios.post('/community/apply').then(res => {
                alert("성공적으로 신청이 완료되었습니다.")
            }).catch(err => {
                alert(err.response.data.message);
            })
        } else{
            location.reload();
        }
    }

    useEffect(() => {
        axios.get('/user/info').then(res => {
            axios.get(`/community/${communityID}`).then(res2 => {
                setUserInfo({
                    ...userInfo,
                    ...res.data,
                    leader: res2.data.leaderID === res.data.userID
                })
            })
        }).catch(err => {

        })
    }, [communityID])

    
    return <>
        <Header />
        {
            (userInfo.communityID === 1) ? <UnloginedCommunityInfo/> : 
            <>
                {userInfo.leader ? <button onClick={() => location.href = '/community/page/edit'}>커뮤니티 수정</button> : null}
                {(userInfo.communityID === communityID) ? <button>글쓰기</button> : 
                (userInfo.communityID === 1) ? <button onClick={e => onClickApplyCommunity(e)}>가입 신청하기</button> : null}
                <h1>소속 커뮤니티 인기 리뷰</h1>
                <ReviewList url='/'/>
                <h1>소속 커뮤니티 최신 리뷰</h1>
                <ReviewList url='/'/>
                <h1>최근 본 리뷰</h1>
                <ReviewList url='/'/>
            </>

        }
    </>
}


ReactDOM.render(<CommunityInfo/>, document.querySelector('#main'));
