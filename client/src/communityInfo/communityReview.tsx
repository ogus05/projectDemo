import { useState } from "react";
import { PaginationBlock } from "../modules/paginationBlock";
import { ReviewList } from "../modules/reviewList"
import './scss/communityReview.scss';

export const CommunityReview = (props: {communityID: number}) => {
    const [orderByCard, setOrderByCard] = useState(0);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const limit= 12;
    return <div className="review">
        <div className="blank"></div>
        <div className="title">
            커뮤니티 최신 리뷰
        </div>
        <div className="card">
            <div className="dateBlock">
                {/* <div className="weeklyCard1" id= {orderByCard === 0 ? "selected" : undefined} onClick={e => setOrderByCard(0)}>
                    주간
                </div>
                <div className="monthlyCard1" id={orderByCard === 1 ? "selected" : undefined} onClick={e => setOrderByCard(1)}>
                    월간
                </div> */}
            </div>
            <ReviewList url= {`/review?offset=${limit * (page - 1)}&limit=${limit}&where=community&query=${props.communityID}`} setCount={setCount}/>
            <PaginationBlock page={page} setPage={setPage} pageCount={Math.floor(count / limit) + 1}/>
        </div>
        </div>
        
}