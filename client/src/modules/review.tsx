
export interface IReview {
    bookTitle: string;
    bookCover: string;
    reviewTitle: string;
    reviewerNickname: string;
    reviewID: number;
}


//TODO. background로 bookCover이미지 넣기
export const Review = (review: IReview) => {

    return <>
        <div className="review">
            책 제목: {review.bookTitle}
            리뷰 제목: {review.reviewTitle}
            리뷰 작성자: {review.reviewerNickname}
        </div>
    </>
}

