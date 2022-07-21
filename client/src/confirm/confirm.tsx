import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { IUserConfirmInfo } from '../interfaces/user.i';
import { PatchPassword } from './patchPassword';
import './scss/confirm.scss';

const Confirm = () => {
    const [nav, setNav] = useState(0);
    const [userInfo, setUserInfo] = useState<IUserConfirmInfo>({
        type: 0, nickname: '', userNumber: 0
    })
    useEffect(() => {
        const token = new URL(location.href).searchParams.get('token');
        axios.get(`/user/confirm/${token}`).then(res => {
            setUserInfo({
                ...res.data,
            });
            setNav(res.data.type);
        }).catch(err => {
            location.href = '/';
        });
    }, []);
    Modal.setAppElement(document.querySelector("#main"));
    return <>
        <img src="/image/page/welcome.png" className="backgroundImage" />
        <Modal isOpen={true} onRequestClose={() => {}} className="confirmModal"
        overlayClassName="confirmModalOverlay"  shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}>
            {(nav === 0) ? 
            <div className='confirmRegister'>
                <div className='logo'>
                    <img src="/image/icon/partyHorn.png"/>
                </div>
                <div className='mainText'>
                    <div className='mainTextOne'>
                        환영합니다!
                    </div>
                    <div className="mainTextTwo">
                        오현석님 회원가입을 축하드립니다.
                    </div>
                </div>
                <div className='subText'>
                    홈페이지를 더욱 편리하게<br/>
                    이용하실 수 있도록<br/>
                    항상 최선을 다하겠습니다.
                </div>
                <div className='button' onClick={e => location.href = '/'}>
                    <div>
                        홈페이지로 가기
                    </div>
                </div>
            </div> : <PatchPassword userInfo= {userInfo}/>}
        </Modal>
    </>
}

ReactDOM.render(<Confirm />, document.querySelector('#main'));