import Modal from 'react-modal';
import "./scss/register.modal2.scss";
export const RegisterModal2 = ({modalIsOpen}) => {
    return <Modal isOpen={modalIsOpen} className="registermodal2"
        appElement={document.querySelector("#mail")}>
            <p>회원 가입을 축하합니다. 로그인 후 이용 가능합니다.</p>
            <button onClick={() => location.href = '/'}>홈으로 가기</button>
    </Modal>
}