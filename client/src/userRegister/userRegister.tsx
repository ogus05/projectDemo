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
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [modal2IsOpen, setModal2IsOpen] = useState(false);

    const submitRegister = e => {
        e.preventDefault();
        if(password !== confirmPassword){
            //수정 있어야 함
            alert("비밀번호 확인이 같지 않습니다.");
            setPassword(''); setConfirmPassword('');
        } else{
            setPassword(passwordEncryptor(password, ID));
            axios.post('/user',{
                ID, nickname, password, email, phone
            }, {
                validateStatus: status => status < 500,
            }).then(res => {
                if(res.status === 201){
                    setModal2IsOpen(true);
                } else{
                    //수정 있어야 함
                    alert(res.data.message);
                    setPassword(''); setConfirmPassword('');
                }
            }).catch(err => {
                //수정 있어야 함
                console.log(err);
                alert("잠시 후 다시 시도해주세요.");
                location.reload();
            })
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
            <label>
                <p>이메일: </p>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="example@reader.com"/><br/>
            </label>
            <label>
                <p>전화 번호: </p>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="010-0000-0000"/><br/>
            </label>
            <br /><label>
                <input type="submit" value="가입하기" />
            </label>
        </form>
    </>
}

ReactDOM.render(<Register />, document.querySelector("#main"));
