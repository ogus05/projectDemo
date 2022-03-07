import { useEffect, useState } from "react";
import { IReview, Review } from "./review"
import './scss/reviewList.scss';


//TODO. offset과 limit ? 제외하기
export const ReviewList = (props: {url: string, offset?: number, limit?: number}) => {
    const [reviews, setReviews] = useState<IReview[]>([]);
    const getReviewList = () => {
        setReviews([
            {
                bookTitle: '책 제목',
                bookCover: '임시url',
                reviewTitle: '리뷰 제목',
                reviewerNickname: '리뷰 작성자',
                reviewID: 1,
            },
            {
                bookTitle: '책 제목',
                bookCover: '임시url',
                reviewTitle: '리뷰 제목',
                reviewerNickname: '리뷰 작성자',
                reviewID: 2,
            },
            {
                bookTitle: '책 제목',
                bookCover: '임시url',
                reviewTitle: '리뷰 제목',
                reviewerNickname: '리뷰 작성자',
                reviewID: 3,
            },
            {
                bookTitle: '책 제목',
                bookCover: '임시url',
                reviewTitle: '리뷰 제목',
                reviewerNickname: '리뷰 작성자',
                reviewID: 4,
            },
            {
                bookTitle: '책 제목',
                bookCover: '임시url',
                reviewTitle: '리뷰 제목',
                reviewerNickname: '리뷰 작성자',
                reviewID: 5,
            },
        ]);
    }
    useEffect(() => {
        getReviewList();
    },[]);
    return <>
        <div className="reviewList">
            {reviews ? reviews.map((review: IReview) => <Review {...review} key={review.reviewID}/>) : null}
        </div>
    </>
}