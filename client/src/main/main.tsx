import React, { useState } from 'react';
import ReactDOM from 'react-dom'
import Header from '../modules/header.logined';
import Footer from '../modules/footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import "./scss/main.scss";
import { Home } from './home';

const Main = () => {
    const [text, setText] = useState('');
    const [nav, setNav] = useState(0);
    const onClickSearch = e => {
        alert(text);
    }
    const onClickNav0 = e => {
        e.preventDefault();

        setNav(0);
    }
    const onClickNav1 = e => {
        e.preventDefault();
        location.href = '/community/page/info';
        setNav(1);
    }
    const onClickNav2 = e => {
        e.preventDefault();
        location.href = '/community/page/search';
        setNav(2);
    }
    return <>
        <Header />
        <div className="top">
            <div className="block">
                <div className="logo" onClick={e => {location.href = '/'}}>
                    <p>
                        The Reader
                    </p>
                </div>
                <div className='nav' id={(nav === 0) ? "checked" : undefined} onClick={onClickNav0}>
                    <p>
                        홈
                    </p>
                </div>
                <div className='nav' id={(nav === 1) ? "checked" : undefined} onClick={onClickNav1}>
                    <p>
                        소속 커뮤니티
                    </p>
                </div>
                <div className='nav' id={(nav === 2) ? "checked" : undefined} onClick={onClickNav2}>
                    <p>
                        커뮤니티 찾기

                    </p>
                </div>
                <div className="searchBlock">
                    {/* <div className="searchBar">
                        <input type="text" className="searchText" value={text} onChange={e => setText(e.target.value)}  placeholder="글쓴이, 제목, 내용 검색"/>
                        <div className="searchButton" onClick={e => onClickSearch(e)}>
                            <FontAwesomeIcon icon={faMagnifyingGlass}/>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
        <article>
            {(nav === 0) ? <Home/> : undefined}
        </article>
        <Footer />
    </>
}

ReactDOM.render(<Main/>, document.querySelector("#main"));