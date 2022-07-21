import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck as faCircleCheck1 } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck as faCircleCheck2 } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';
export const RegisterModal = ({registerIsOpen, setRegisterIsOpen, completeIsOpen, setCompleteIsOpen, setAccept}) => {
    const [acceptInner, setAcceptInner] = useState({
        1: false, 2: false
    });
    Modal.setAppElement(document.querySelector("#main"));
    
    const onClickAccept = () => {
        if(acceptInner[1] && acceptInner[2]){
            setAccept(true);
            setRegisterIsOpen(false);
        }
    }

    return <>
        <Modal isOpen={completeIsOpen} onRequestClose={() => location.reload()} className="completeModal"
        overlayClassName="completeModalOverlay" shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}>
                <div className="logo">
                    <FontAwesomeIcon icon={faCircleCheck2}/>
                </div>
                <div className="mainText">
                    축하합니다!<br/>가입이 완료되었습니다.
                </div>
                <div className="subText">
                    가입한 이메일을 통해 인증해 주세요.
                </div>
                <div className="backToLogin" onClick={e => location.reload()}>
                <div>
                    로그인 화면으로 돌아가기
                </div>
            </div>
        </Modal>
        <Modal isOpen={registerIsOpen} onRequestClose={() => setRegisterIsOpen(false)} className="registerModal"
        overlayClassName="registerModalOverlay" shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}>
            <div className="modalBlock">
                <div className="exitButtonBlock">
                <div onClick={() => {
                        setRegisterIsOpen(false);
                        setAccept(false);}}>
                            <FontAwesomeIcon icon={faXmark}/>
                        </div>
                </div>
                <div className="mainText">
                    이용 약관 동의
                </div>
                <div className="subText">
                    더리더 서비스와 다양한 혜택을 위해<br/>약관 동의가 필요해요!
                </div>
            </div>
            <div className="acceptBlock">
                <div className='acceptAll'>
                    <div className='checkButton'>
                        <div>
                            {Object.values(acceptInner).every((v, i) => v) ? 
                            <FontAwesomeIcon icon={faCircleCheck1} color="#74603B"
                            onClick={() => setAcceptInner({
                                1: false, 2: false,
                            })}/> : 
                            <FontAwesomeIcon icon={faCircleCheck2} color="#74603B"
                            onClick={() => setAcceptInner({
                                1: true, 2: true,
                            })}/>}
                        </div>
                    </div>
                    <div className='text'>
                        전체 동의
                    </div>
                </div>
                <div className="accept">
                    <div className='acceptOne'>
                            <div className='checkButton'>
                        <div>
                                {acceptInner[1] ? 
                                <FontAwesomeIcon icon={faCircleCheck1} color="#74603B"
                                onClick={() => setAcceptInner({...acceptInner, 1: false})}/> : 
                                <FontAwesomeIcon icon={faCircleCheck2} color="#74603B"
                                onClick={() => setAcceptInner({...acceptInner, 1: true})}/>}
                            </div>
                        </div>
                        <div className='text'>
                            서비스 이용 약관(필수)
                        </div>
                    </div>
                    <div className='acceptOne'>
                        <div className='checkButton'>
                            <div>
                                {acceptInner[2] ? 
                                <FontAwesomeIcon icon={faCircleCheck1} color="#74603B"
                                onClick={() => setAcceptInner({...acceptInner, 2: false})}/> : 
                                <FontAwesomeIcon icon={faCircleCheck2} color="#74603B"
                                onClick={() => setAcceptInner({...acceptInner, 2: true})}/>}
                            </div>
                        </div>
                        <div className='text'>
                            개인정보 수집 및 이용동의(필수)
                        </div>
                    </div>
                </div>
            </div>
            <div className="completeButton" onClick={e => onClickAccept()}>
                <div>
                    완료
                </div>
            </div>
        </Modal>
</>
}