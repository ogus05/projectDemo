import ReactDOM from 'react-dom';
import Header from '../modules/header.logined';
import Footer from '../modules/footer';
import './scss/userEdit.scss';
import { Logo } from '../modules/logo';
import { ProfileEdit } from './profileEdit';
import { useState } from 'react';
import PasswordEdit from './passwordEdit';

const UserEdit = () => {
    const [nav, setNav] = useState(0);
    return <>
        <Header/>
        <article>
            <Logo/>
            <div className="userNav">
                <div className="title" onClick={e => setNav(0)} id ={nav !== 0 ? "unChecked" : undefined}>
                    프로필 수정
                </div>
                <div className="title" onClick={e => setNav(1)} id ={nav !== 1 ? "unChecked" : undefined}>
                    비밀번호 수정
                </div>
            </div>
            <div className="card">
                {nav === 0 ? 
                <ProfileEdit/>
                : <PasswordEdit/>
                }
            </div>
            
        </article>
        <Footer/>
    </>
}

ReactDOM.render(<UserEdit/>, document.querySelector("#main"));
