import {Header} from "../modules/header.unlogined";
import ReactDOM from 'react-dom';
import "./scss/userHelp.scss"
import { useState } from "react";
import { FindPassword } from "./findPassword";
import { FindID } from "./findID";

const UserHelp = () => {
    const [findNav, setFindNav] = useState(true);
    return <>
        <Header/>
        <nav>
            <div onClick={() => setFindNav(true)}>
                <p>아이디 찾기</p>
            </div>
            <div onClick={() => setFindNav(false)}>
                <p>비밀번호 찾기</p>
            </div>
        </nav>
        {findNav ? <FindID/> : <FindPassword/>}

    </>
}

ReactDOM.render(<UserHelp />, document.querySelector("#main"));
