import axios from "axios";
import { useEffect, useState } from "react";
import { IReviewList } from "../interfaces/review.i";

//TODO. background로 bookCover이미지 넣기
export const Review = (props: {review: IReviewList}) => {
    const [bookInfo, setBookInfo] = useState<any>('');
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        axios.get(`/review/book/info/${props.review.ISBN}`).then(res => {
            let title: string = res.data.title;
            title = title.substring(0, title.indexOf('('));
            setBookInfo({
                ...res.data,
                title
            });
            setLoading(false)
        });
    }, [])
    return <>
        {loading ? null : 
        <div className="review">
            <div className="cover">
                <img src={bookInfo.thumbnail}/>
            </div>
            <div className="information">
                <div>
                    [{bookInfo.title}]{props.review.title}<br/>
                </div>
                <div>
                    {props.review.community.name}<br/>
                </div>
                <div>
                    {props.review.user.nickname}<br/>
                </div>
                <div className="regDate">
                    {props.review.regDate}<br/>
                </div>
            </div>
        </div>}
    </>
}

