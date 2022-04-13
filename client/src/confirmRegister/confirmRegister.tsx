import React from 'react';
import ReactDOM from 'react-dom';
import {Header} from '../modules/header.unlogined';

const ConfirmRegister = () => {
    const userID = document.querySelector("#main")?.getAttribute("userID");
    return <>
        <Header />
        <h2>{userID}님 환영합니다!!</h2>

    </>
}

ReactDOM.render(<ConfirmRegister />, document.querySelector('#main'));