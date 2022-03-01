import React from 'react';
import ReactDOM from 'react-dom'
import { ReviewList } from './reviewList';
import Header from '../modules/header';

const Main = () => {
    return <>
        <Header />
        <ReviewList url="/" listName='인기 리뷰'/>
        <ReviewList url="/" listName='소속 커뮤니티 최신 리뷰'/>
        <ReviewList url="/" listName='최근 본 리뷰'/>
    </>
}

ReactDOM.render(<Main/>, document.querySelector("#main"));