import axios from "axios";
import { useEffect, useState } from "react";
import { IReviewList } from "../interfaces/review.i";
import { Review } from "./review";
import './scss/reviewList.scss';


export const ReviewList = (props: {url: string, setCount: any}) => {
    const [reviewList, setReviewList] = useState<IReviewList[]>([]);
    const getReviewList = () => {
        axios.get(props.url).then(res => {
            setReviewList(res.data.reviewList.map((v, i) => {
                const regDate = new Date(v.regDate);
                v.regDate = `${regDate.getFullYear()}-${("00" + (regDate.getMonth() + 1)).slice(-2)}-${("00" + regDate.getDate()).slice(-2)}`
                return v;
            }));
            props.setCount(res.data.count);
        })
    }
    useEffect(() => {
        getReviewList();
    },[props.url]);
    return <>
    {
        Array.isArray(reviewList) && reviewList.length !== 0 ? 
        <div className="reviewList">
            {reviewList.map((review: IReviewList, i) => {
                return <div className="reviewBlock" key={i} onClick={e => location.href = `/review/page/info/${review.ID}`}>
                        <div className="number">
                            {i + 1}
                        </div>
                        <Review review={review} key={i}/>
                    </div>
        })}</div> : <div className="emptyReviewList">
                등록된 리뷰가 존재하지 않습니다.
            </div>

    }
    </>
}