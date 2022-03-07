import React from 'react';
import ReactDOM from 'react-dom';
import Header from '../modules/header.logined';

const CommunitySearch = () => {
    return <>
        <Header />
        <h2>커뮤니티 찾기</h2>
    </>
}

ReactDOM.render(<CommunitySearch />, document.querySelector('#main'));