import ReactDOM from 'react-dom';
import Footer from '../modules/footer';
import Header from '../modules/header.logined';
import { SearchBlock } from '../modules/searchBlock';
import { ICommunitySearch } from '../interfaces/community.i';
import './scss/communitySearch.scss';
import { useEffect, useState } from 'react';
import { PaginationBlock } from '../modules/paginationBlock';
import { Logo } from '../modules/logo';
import axios from 'axios';

const CommunitySearch = () => {
    const [page, setPage] = useState(1);
    const [communityList, setCommunityList] = useState<ICommunitySearch[]>([]);
    const [count, setCount] = useState(0);
    const limit = 10;
    useEffect(() => {
        axios.get(`/community/search?offset=${(page  - 1) * limit}&limit=${limit}`).then(res => {
            setCommunityList(res.data.communityList);
            setCount(res.data.count);
        })
    }, [])
    const onClickSearch = () => {
        
    }
    return <>
        <Header/>
            <article>
                <Logo/>
                <div className="title">
                    커뮤니티 찾기
                </div>
                <div className="card">
                    <SearchBlock onClickSearch={onClickSearch}/>
                    <div className='communityList'>
                        {communityList.map((v, i) => {
                            return <Community community={v} key={i}/>
                        })}
                    </div>
                    <PaginationBlock page={page} setPage={setPage} pageCount={count / page + 1}/>
                </div>
            </article>
        <Footer/>
    </>
}

const Community = (props:{community: ICommunitySearch }) => {
    return <div className="community" onClick={e => location.href = `/community/page/info/${props.community.ID}`}>
        <div className="image">
            <img src={`/image/community/${props.community.ID}`} onError={(e: any) => e.target.setAttribute('src', '/image/community/default')} />
        </div>
        <div className="name">
            {props.community.name}
        </div>
        <div className="message">
            {props.community.message}
        </div>
    </div>
}

ReactDOM.render(<CommunitySearch />, document.querySelector('#main'));