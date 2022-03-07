import React from 'react';
import './scss/header.logined.scss';
import jwtInterceptor from './ts/jwtInterceptor';

const Header = () => {
    const clickLogout = e => {
        e.preventDefault();
        jwtInterceptor.delete('/auth')
        .then(res => {
            location.href = '/';
        }).catch(err => {
            console.log(err);
            location.href = '/';
        })
    }

    const clickMyPage = e => {
        e.preventDefault();
        location.href = "/user/page/info";
    }

    const clickMyCommunity = e => {
        e.preventDefault();
        location.href = "/community/page/info";
    }
    
    return <header>
        <h1 id="title" onClick ={e => {location.href = '/'}}>The Reader</h1>
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