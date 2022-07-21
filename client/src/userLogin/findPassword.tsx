import { useEffect, useState } from 'react';
import './scss/findPassword.scss';
import Modal from 'react-modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

export const FindPassword = () => {
    const [userID, setUserID] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    Modal.setAppElement(document.querySelector("#main"));
    const onSubmit= e =>{
        e.preventDefault();
        axios.post('/user/confirm', {
            ID: userID,
            type: 1,
        }).then(res => {
            setModalIsOpen(true);
        }).catch(err => {
            if(err.response.status > 499){
                setAlertMessage('서버 오류입니다 나중에 다시 시도 해 주세요.');
            }
            const message = err.response.data.message;
            if(Array.isArray(message)){
                message.every((v, i) => {
                    const value = v.substring(v.indexOf(':') + 1);
                    setAlertMessage(value);
                })
            }else{
                setAlertMessage(message);
            }
        })

    }
    return <>
        <div className="findPassword">
            <form onSubmit={e => onSubmit(e)}>
                <div className="findPasswordTitle">
                    비밀번호 찾기
                    <div className="findPasswordSubtitle">
                        가입한 메일 주소를 입력해주세요.<br/>
                        비밀번호 변경 메일을 보내드립니다.
                    </div>
                </div>
                <div className="emailBlock">
                    <div>메일 주소</div>
                    <input type="text" placeholder="메일 주소를 입력해주세요." 
                    value={userID} onChange={e => setUserID(e.target.value)}/>
                    <div className="alert">{alertMessage}</div>
                </div>
                    <input type="submit" value="메일 보내기" className='submitBlock'/>
            </form>
        </div>
        <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="findPasswordModal"
        overlayClassName="findPasswordModalOverlay" shouldCloseOnEsc={false} shouldCloseOnOverlayClick={false}>
            <div className='modalBlock'>
                <div className="exitButtonBlock">
                    <div onClick={() => setModalIsOpen(false)}>
                        <FontAwesomeIcon icon={faXmark}/>
                    </div>
                </div>
                <div className="mainText">
                    비밀번호 변경<br/>메일을 보냈습니다.
                </div>
                <div className="subText">
                    비밀번호 변경을 위한 메일을<br/>{userID}<br/>로 보냈습니다.<br/>
                    메일에 기재된 링크를 클릭하여<br/>새 비밀번호를 설정해 주세요.
                </div>
            </div>
            <div className="backToLogin" onClick={() => location.href = '/user/page/login'}>
                <div>
                    로그인 화면으로 돌아가기
                </div>
            </div>
        </Modal>
    </>
    
}