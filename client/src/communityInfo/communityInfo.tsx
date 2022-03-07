import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Header from '../modules/header.logined';
import { ReviewList } from '../modules/reviewList';
import { UnloginedCommunityInfo } from './unloginedCommunityInfo';

const CommunityInfo = () => {
    const userCommunityID = document.querySelector('#main')?.getAttribute('userCommunityID');
    const communityID = document.querySelector('#main')?.getAttribute('communtyID');
    const [community, setCommunity] = useState(null);
    useEffect(() => {
        axios.get(`/community/${communityID ? communityID : ''}`).then(res => {
            setCommunity(res.data);
        });
    })

    
    return <>
        <Header />
        {
            (userCommunityID === "1") ? <UnloginedCommunityInfo/> : 
            <>
                {(userCommunityID === communityID) ? <button>글쓰기</button> : null}
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
