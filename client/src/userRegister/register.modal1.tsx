import { useState } from 'react';
import Modal from 'react-modal';
import "./scss/register.modal1.scss"

export const RegisterModal1 = () => {
    const [modalIsOpen, setModalIsOpen] = useState(true);
    const onClickReject = e => {
        e.preventDefault();
        alert("동의하지 않으면 가입이 불가능합니다.");
        location.href = '/';
    }
    return <Modal isOpen={modalIsOpen} className="registermodal1"
        appElement={document.querySelector("#main")}>
        <p>약관 내용들</p>
        <button onClick={() => setModalIsOpen(false)}>동의</button>
        <button onClick={onClickReject}>거절</button>
    </Modal>
}