import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ICommunityInfo } from '../interfaces/community.i';
import { IUserCommunityInfo } from '../interfaces/user.i';
import Header from '../modules/header.logined';
import {Logo} from '../modules/logo';
import './scss/communityInfo.scss';
import { CommunityReview } from './communityReview';
import Footer from '../modules/footer';

const CommunityInfo = () => {
    const [user, setUser] = useState<IUserCommunityInfo>({
        number: 1, nickname: '', communityID: 1
    });
    const [community, setCommunity] = useState<ICommunityInfo>({
        message: '', regDate: '', name: '', leader: {
            number: 0,
            nickname: '',
        }
    })
    const communityID = parseInt(document.querySelector('#main')?.getAttribute('communityID') as string, 10);
    const onClickApplyCommunity = e => {
        e.preventDefault();
        if(confirm("가입 신청 시 이전에 가입 신청들이 사라질 수 있습니다.")){
            axios.post(`/community/apply/${communityID}`).then(res => {
                alert("성공적으로 신청이 완료되었습니다.");
                location.reload();
            }).catch(err => {
                alert(err.response.data.message);
            })
        }
    }

    const onClickLeaveCommunity = e => {
        e.preventDefault();
        if(confirm("커뮤니티를 탈퇴합니다.")){
            axios.delete(`/community/user`).then(res => {
                location.reload();
            }).catch(e => {
                alert(e.response.data.message);
                location.reload();
            })
        }
    }

    useEffect(() => {
        axios.get(`/community/info/${communityID}`).then(res => {
            setCommunity(res.data);
        });
        axios.get(`/user/community/info`).then(res => {
            setUser(res.data);
        });
    }, [])
    
    return <>
        <Header />
        <article>
            <Logo />
            <div className="community">
                <div className="communityImage">
                    <div className="block">
                        <img src={`/image/community/${communityID}`} onError={(e: any) => e.target.setAttribute('src', '/image/community/default')} />
                        {/* <div className="communityImageEdit">
                            <FontAwesomeIcon icon={faPlus} />
                        </div> */}
                    </div>
                </div>
                <div className="communityInfo">
                    <p className='communityName'>
                        {community.name}
                    </p>
                    <p className="leaderNickname">
                        {community.leader.nickname}
                    </p>
                </div>
                    <div className="communityMessage">
                        {(community.message) ? community.message : "아직 자기소개가 작성되지 않았습니다."}
                    </div>
                <div className="communityButton">
                    {user.communityID === communityID ?
                    <button onClick={e => location.href = '/review/page/register'}>글쓰기</button> : null}
                    {user.number === community.leader.number ? 
                    <button onClick={e => (location.href = "/community/page/edit")}>커뮤니티 수정</button>
                    : null}
                    {user.communityID === 1 ?
                    <button onClick={onClickApplyCommunity}>커뮤니티 가입 신청</button> : null}
                </div>
                {user.number !== community.leader.number && 
                user.communityID === communityID ? 
                <div className="leaveCommunity" onClick={onClickLeaveCommunity}>
                    커뮤니티 탈퇴
                </div> : null}
            </div>
            <CommunityReview communityID={communityID}/>
        </article>
        <Footer/>
    </>
}


ReactDOM.render(<CommunityInfo/>, document.querySelector('#main'));
