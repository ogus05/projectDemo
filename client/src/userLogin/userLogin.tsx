import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FindPassword } from './findPassword';
import { Login } from './login';
import { Register } from './register';
import "./scss/userLogin.scss";

const UserLogin = () => {
    const [nav, setNav] = useState(0);
    useEffect(() => {
        const urlParams = new URL(location.href).searchParams;
        if(urlParams.has('nav')){
            const navParam = parseInt(urlParams.get('nav') as string, 10);
            if(-1 < navParam && navParam < 3){
                setNav(navParam);
            }
        }
    }, [])
    return <>
        <div className="image-section">
        </div>
        <div className="user-section">
            {(nav === 0) ? <Login/> : <>{(nav === 1) ? <FindPassword/> : <Register/>}</>}
            <div className="caption">
                {(nav === 0) ? <>
                    <span onClick={e => setNav(1)}>비밀번호 찾기</span>
                    <span onClick={e => setNav(2)}>회원가입</span>
                </> : <>
                    <span onClick={e => setNav(0)}>로그인</span>
                </>}
                
            </div>

        </div>
    </>
}

ReactDOM.render(<UserLogin/>, document.querySelector("#main"));