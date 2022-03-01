import "./scss/register.scss";
import ReactDOM from 'react-dom'
import RegisterHeader from "./register.header";
import { useState } from "react";

const Register = () => {
    const [userID, setUserID] = useState('');
    const [userNickname, setUserNickname] = useState('');
    const [userPassword, setUserPassword] = useState('');

    const submitRegister = e => {
        e.preventDefault();
        console.log(userID)
        console.log(userNickname);
        console.log(userPassword);
        location.reload();
    }

    return <>
        <RegisterHeader />
        <form onSubmit={submitRegister}>
            <label>
                <p>아이디: </p>
                <input type="text" value={userID} onChange={e => setUserID(e.target.value)}/><br/>
            </label>
            <label>
                <p>닉네임: </p>
                <input type="text" value={userNickname} onChange={e => setUserNickname(e.target.value)} /><br/>
            </label>
            <label>
                <p>비밀번호: </p>
                <input type="password" value={userPassword} onChange={e => setUserPassword(e.target.value)} /><br/>
            </label>
            <label>
                <input type="submit" value="가입하기" />
            </label>
        </form>
    </>
}

ReactDOM.render(<Register />, document.querySelector("#main"));
