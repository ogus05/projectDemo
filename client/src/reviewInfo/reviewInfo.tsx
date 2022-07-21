import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { IReviewInfo } from '../interfaces/review.i';
import Footer from '../modules/footer';
import Header from '../modules/header.logined';
import { Logo } from '../modules/logo';
import { Comment } from './comment';
import './scss/reviewInfo.scss';

const ReviewInfo = () => {
    const [reviewInfo, setReviewInfo] = useState<IReviewInfo>({
            ID: 0, title: '', text: '', regDate: '', user: {
                nickname: '',
                number: 1,
        }
    });
    const [count, setCount] = useState(0);
    const [reviewID, setReviewID] = useState(location.pathname.substring(location.pathname.lastIndexOf('/') + 1));
    useEffect(() => {
        axios.get(`/review/info/${reviewID}`).then(res => {
            if(res.data){
                const regDate = new Date(res.data.review.regDate);
                setReviewInfo({...res.data.review, 
                    review: {
                        regDate: `${regDate.getFullYear()}-${("00" + (regDate.getMonth() + 1)).slice(-2)}-${("00" + regDate.getDate()).slice(-2)} ${("00" + regDate.getHours()).slice(-2)}:${("00" + regDate.getMinutes()).slice(-2)}`
                    }
                });
                setCount(res.data.count);
                
            }
        });
    }, [])
    return <>
        <Header/>
        <article>
            <Logo/>
            <div className='buttonBlock'>
                <div className="title">
                    책 리뷰
                </div>
                <div className="swipe">
                    {reviewInfo.ID !== 1 ?
                    <div className="leftBlock" onClick={e => location.href=`${reviewInfo.ID - 1}`}>
                        <div className="left">
                            이전 리뷰
                        </div>
                    </div>: <div>
                        </div>
                    }{
                        count !== reviewInfo.ID ?
                    <div className="rightBlock" onClick={e => location.href=`${reviewInfo.ID + 1}`}>
                        <div className="right">
                            다음 리뷰
                        </div>
                    </div>: <div></div>
                    }
                </div>
            </div>
            <div className="review">
                <div className="top">
                    <div className="blank"></div>
                    <div className="reviewTitle">{reviewInfo.title}</div>
                    <div className="reviewInfo">
                        {reviewInfo.user.nickname} {reviewInfo.regDate}
                    </div>
                </div>
                <div className="text">
                    {reviewInfo.text}
                </div>
            </div>
            <Comment reviewID= {parseInt(reviewID)}/>
        </article>
        <Footer/>
    </>
}

ReactDOM.render(<ReviewInfo/>, document.querySelector('#main'));