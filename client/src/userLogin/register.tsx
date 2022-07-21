import axios from "axios";
import { useState } from "react";
import passwordEncryptor from "../modules/ts/passwordEncryptor";
import { RegisterModal } from "./registerModal";
import './scss/register.scss';

export const Register = () => {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [accept, setAccept] = useState(false);
    const [registerModalIsOpen, setRegisterModalIsOpen] = useState(false);
    const [completeModalIsOpen, setCompleteModalIsOpen] = useState(false);
    const [registerAlert, setRegisterAlert] = useState({
        ID: '', password: '', confirmPassword: '', nickname: '', accept: '',
    })

    const submitRegister = e => {
        e.preventDefault();
        //비밀번호 조건은 클라이언트에서 체크.
        const tempRegisterAlert = {
            ID: '', password: '', confirmPassword: '', nickname: '', accept: ''
        }
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/g;
        if(password !== confirmPassword){
            tempRegisterAlert.confirmPassword = '비밀번호 확인이 비밀번호와 같지 않습니다.';
        } else if(password.indexOf(' ') !== -1){
            tempRegisterAlert.password= '비밀번호는 공백 사용이 불가능합니다.';
        } else if(!passwordRegex.test(password)){
            tempRegisterAlert.password="비밀번호는 문자, 숫자, 특수문자로 조합된 8글자 이상의 문장이여야 합니다.";
        }
        else if(!accept){
            tempRegisterAlert.accept="이용약관에 동의해주세요."
        } else{
            axios.post('/user',{
                ID: userID, nickname, password : passwordEncryptor(password, userID),
            }, {
                validateStatus: status => status < 500,
            }).then(res => {
                if(res.status === 201){
                    setCompleteModalIsOpen(true);
                } else{
                    const message: string[] = res.data.message;
                    message.forEach((v, i) => {
                        const key = v.substring(0, v.indexOf(':'));
                        const value = v.substring(v.indexOf(':') + 1, ).trim();
                        tempRegisterAlert[key] = value;
                    });
                    setRegisterAlert(tempRegisterAlert);
                    setPassword(''); setConfirmPassword('');
                }
            });
        }
        setRegisterAlert(tempRegisterAlert);
        setPassword(''); setConfirmPassword('');
    }
    return <>
        <div className="register">
            <form onSubmit={e => submitRegister(e)}>
                <div className="registerTitle">
                    <p>회원가입</p>
                </div>
                <div className="userIdBlock">
                    <div>이메일</div>
                    <input type="text" placeholder="이메일을 입력 해 주세요." autoComplete="off"
                    value={userID} onChange={e => setUserID(e.target.value)}/>
                    <div className="alert">{registerAlert.ID}</div>
                </div>
                <div className="passwordBlock">
                    <div>비밀번호</div>
                    <input type="password" placeholder="비밀번호를 입력 해 주세요." autoComplete="off"
                    value={password} onChange={e=>setPassword(e.target.value)}/>
                    <div className="alert">{registerAlert.password}</div>
                </div>
                <div className="confirmPasswordBlock">
                    <div>비밀번호 재확인</div>
                    <input type="password" placeholder="비밀번호를 다시 입력 해 주세요." autoComplete="off"
                    value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}/>
                    <div className="alert">{registerAlert.confirmPassword}</div>
                </div>
                <div className="nicknameBlock">
                    <div>닉네임</div>
                    <input type="text" placeholder="닉네임을 입력 해 주세요." autoComplete="off"
                    value={nickname} onChange={e=>setNickname(e.target.value)}/>
                    <div className="alert">{registerAlert.nickname}</div>
                </div>
                <div className="submitBlock">
                    <div className="acceptButtonBlock">
                        <input type="checkbox" checked={accept} onChange={e => setRegisterModalIsOpen(true)}/>
                        <div className="text">
                            이용약관
                        </div>
                        <div className="alert">{registerAlert.accept}</div>
                    </div>
                    <input type="submit" value="회원가입" className="submitButton" />
                </div>
            </form>
        </div>
        <RegisterModal registerIsOpen={registerModalIsOpen} setRegisterIsOpen={setRegisterModalIsOpen}
        completeIsOpen={completeModalIsOpen} setCompleteIsOpen={setCompleteModalIsOpen}
        setAccept={setAccept}/>
    </>
}