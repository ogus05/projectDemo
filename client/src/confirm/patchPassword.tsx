import axios from 'axios';
import { useState } from 'react';
import { IUserConfirmInfo } from '../interfaces/user.i';
import passwordEncryptor from '../modules/ts/passwordEncryptor';
import './scss/patchPassword.scss';


export const PatchPassword = (props: {userInfo: IUserConfirmInfo}) => {
    const [ID, setID] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [alert, setAlert] = useState('');
    const [nav, setNav] = useState(0);
    const onClickSubmit = e => {
        e.preventDefault();
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/g;
        if(password !== confirmPassword){
            setAlert("비밀번호 확인이 정확하지 않습니다.");
        } else if(password.indexOf(' ') !== -1){
            setAlert("비밀번호는 공백 사용이 불가능합니다.");
        } else if(!passwordRegex.test(password)){
            setAlert("비밀번호는 문자, 숫자, 특수문자로 조합된 8글자 이상의 문장이여야 합니다.");
        } else{
            axios.patch('/user/password', {
                ID,
                number: props.userInfo.userNumber,
                currentPassword: '',
                newPassword: passwordEncryptor(password, ID)
            }).then(res => {
                setNav(1);
            }).catch(err => {
                setAlert(err.response.data.message);
            })
        }
        setPassword('');
        setConfirmPassword('');
    }
    return <> {nav === 0 ? 
        <div className="patchPassword">
            <div className="mainText">
                새 비밀번호 입력
            </div>
            <div className="id">
                <div className="test">
                    아이디
                </div>
                <input type="text" value={ID} onChange={e => setID(e.target.value)}/>
            </div>
            <div className="password">
                <div className="text">
                    새 비밀번호
                </div>
                <input type="password"  value={password} onChange={e => setPassword(e.target.value)}/>
            </div>
            <div className="confirmPassword">
                <div className="text">
                    비밀번호 확인
                </div>
                <input type="password"  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
            </div>
            <div className="alert">{alert}</div>
            <div className="button" onClick={e => onClickSubmit(e)}>
                <div>
                    비밀번호 변경
                </div>
            </div>
        </div> : <div className="patchPasswordConfirm">
            <div className="logo">
                <img src="/image/icon/checkRing.png"/>
            </div>
            <div className="mainText">
                변경이<br/>완료되었습니다!
            </div>
            <div className="subText">
                새로운 비밀번호로 로그인 해주세요.
            </div>
            <div className="button" onClick={e => location.href = '/'}>
                <div>
                    홈페이지로 가기
                </div>
            </div>
        </div>
}</>
}