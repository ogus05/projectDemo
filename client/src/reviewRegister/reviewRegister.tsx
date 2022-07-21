import { useState } from 'react';
import ReactDOM from 'react-dom';
import Footer from '../modules/footer';
import Header from '../modules/header.logined';
import { Logo } from '../modules/logo';
import './scss/reviewRegister.scss';
import { ToastEditor } from './toastEditor';

const ReviewRegister = () => {
    const topicText = [
        '책을 읽게 된 동기',
        '줄거리',
        '인상적인 대목',
        '이 책을 추천해 주고 싶은 사람',
        '내 삶에 적용하고 싶은 것',
        '내가 주인공이라면?',
        '등장인물을 통해 얻은 교휸',
    ];
    const [topic, setTopic] = useState(new Array(7).fill(false) as boolean[]);
    return <>
        <Header/>
        <article>
            <Logo/>
            <div className="title">
                글쓰기
            </div>
            <div className="card">
                <div className="review">
                    <div className="reviewTitle">
                        <input type="text" placeholder='제목을 입력하세요.'/>
                    </div>
                    <div className="reviewTopic">
                        <div className="topic">
                            <input type="checkbox" checked={topic.every((v, i) => v === false)} onChange={e => 
                                setTopic(new Array(7).fill(false))
                            }/>
                            없음
                        </div>
                        {topicText.map((v, i) => {
                            return <div className='topic' key={i}>
                                <input type="checkbox" checked={topic[i]} onChange={e => {
                                    setTopic(topic.map((v, i2) => {
                                        if(i === i2) return !topic[i2];
                                        else return topic[i2];
                                    }))
                                }} key = {i}/>
                                {v}
                            </div>
                        })}
                    </div>
                    <ToastEditor/>
                    <div className="reviewButton">
                        <div className="button">글쓰기</div>
                    </div>
                </div>
            </div>
        </article>
        <Footer/>

    </>
}

ReactDOM.render(<ReviewRegister/>, document.querySelector('#main'));