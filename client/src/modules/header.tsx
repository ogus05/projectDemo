import React from 'react';
import './scss/header.scss';

const Header = () => {
    const clickLogout = e => {
        e.preventDefault();
        alert('click logout');
    }

    const clickMyPage = e => {
        e.preventDefault();
        alert('click my page');
    }

    const clickMyCommunity = e => {
        e.preventDefault();
        alert('click my community');
    }
    
    return <header>
        <h1 id="title" onClick ={e => {location.href = '/main'}}>The Reader</h1>
        <nav id="myLink">
            <div onClick={clickLogout}>
                logout
            </div>
            <div onClick={clickMyPage}>
                my page
            </div>
            <div onClick={clickMyCommunity}>
                my community
            </div>
        </nav>
    </header>
}

export default Header;