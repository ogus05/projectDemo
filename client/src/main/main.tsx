import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import { ReviewList } from '../modules/reviewList';
import Header from '../modules/header.logined';

const Main = () => {
    const [arrange, setArrange] = useState(0);
    const [category, setCategory] = useState(0);

    const onClickArrange = e => {
        e.preventDefault();
        console.log(arrange);
        console.log(category);
    }

    return <>
        <Header />
        <h1>The Reader 인기 리뷰</h1>
        <div>
            <p>나열 순서:&nbsp;&nbsp;
            <select onChange={e => setArrange(e.target.value as any)}>
                <option value={0}>선택</option>
                <option value={1}>조회</option>
                <option value={2}>좋아요</option>
                <option value={3}>등등</option>
            </select>
            </p>
            <p>카테고리 선택:&nbsp;&nbsp;
            <select onChange={e => setCategory(e.target.value as any)}>
                <option value={0}>선택</option>
                <option value={1}>카테고리 1</option>
                <option value={2}>카테고리 2</option>
                <option value={3}>등등</option>
            </select>
            </p>
            <button onClick={onClickArrange}>정렬하기</button>
        </div>
        <ReviewList url="/"/>
    </>
}

ReactDOM.render(<Main/>, document.querySelector("#main"));