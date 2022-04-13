import "./scss/userRegister.scss";
import ReactDOM from 'react-dom'
import {Header} from "../modules/header.unlogined";
import { RegisterModal1 } from "./register.modal1";
import { RegisterModal2 } from "./register.modal2";
import { useState } from "react";
import passwordEncryptor from "../modules/ts/passwordEncryptor";
import axios from "axios";

const Register = () => {
    const [ID, setID] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modal2IsOpen, setModal2IsOpen] = useState(false);

    const submitRegister = e => {
        e.preventDefault();
        //비밀번호 조건은 클라이언트에서 체크.
        if(password !== confirmPassword){
            alert("비밀번호 확인이 같지 않습니다.");
            setPassword(''); setConfirmPassword('');
        } else{
            axios.post('/user',{
                ID, nickname, password : passwordEncryptor(password, ID),
            }, {
                validateStatus: status => status < 500,
            }).then(res => {
                if(res.status === 201){
                    setModal2IsOpen(true);
                } else{
                    alert(res.data.message);
                    setPassword(''); setConfirmPassword('');
                }
            });
        }
    }

    return <>
        <Header />
        <RegisterModal1 />
        <RegisterModal2 modalIsOpen={modal2IsOpen}/>
        <form onSubmit={submitRegister}>
            <label>
                <p>아이디: </p>
                <input type="text" value={ID} onChange={e => setID(e.target.value)}/><br/>
            </label>
            <label>
                <p>비밀번호: </p>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} /><br/>
            </label>
            <label>
                <p>비밀번호 확인: </p>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /><br/>
            </label>
            <label>
                <p>닉네임: </p>
                <input type="text" value={nickname} onChange={e => setNickname(e.target.value)} /><br/>
            </label>
            <br /><label>
                <input type="submit" value="가입하기" />
            </label>
        </form>
    </>
}

ReactDOM.render(<Register />, document.querySelector("#main"));
