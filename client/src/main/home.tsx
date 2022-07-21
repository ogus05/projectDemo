import { useState } from "react";
import { ReviewList } from "../modules/reviewList";
import './scss/home.scss';

export const Home = () => {
    const [orderByCard, setOrderByCard] = useState(0);
    const limit = 12;
    return <> 
        <div className="title">
            The Reader 추천 리뷰
        </div>
        <div className="card" id="mainCard">
            <div className="left">{"<"}</div>
            <div className="right">{">"}</div>
        </div>
        <div className="blank"></div>
        <div className="title">
            The Reader 최신 리뷰
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
            <ReviewList url= {`/review?offset=0&limit=${limit}`} setCount={null}/>
        </div>
        <div className="blank"></div>
    </>
}