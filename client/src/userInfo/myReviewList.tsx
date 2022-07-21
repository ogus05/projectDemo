import { useEffect, useState } from "react";
import { ReviewList } from "../modules/reviewList";
import { PaginationBlock } from "../modules/paginationBlock";
import "./scss/myReviewList.scss";
import { SearchBlock } from "../modules/searchBlock";
import axios from "axios";


export const MyReviewList = (props: {userNumber: number}) => {
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const limit = 12;
    const onClickSearch = (text: string) => {
    }
    
    useEffect(() => {
    }, [])

    return <div className="myReviewList">
        <SearchBlock onClickSearch={onClickSearch}/>
        <ReviewList url={`/review?offset=${(page - 1) * limit}&limit=${limit}&where=user&query=${props.userNumber}`} setCount={setCount}/>
        <PaginationBlock page={page} setPage={setPage} pageCount={count / limit + 1}/>
    </div>
}