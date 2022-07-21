import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import "./scss/searchBlock.scss";
import { useState } from 'react';

export const SearchBlock = (props: {onClickSearch: (text: string) => void}) => {
    const [text, setText] = useState('');
    const onClickSearch = e => {
        e.preventDefault();
        setText('');
        props.onClickSearch(text);
    }
    return <div className="searchBlock">
        {/* <div className="searchBar">
            <input type="text" className="searchText" value={text} onChange={e => setText(e.target.value)}  placeholder="글쓴이, 제목, 내용 검색"/>
            <div className="searchButton" onClick={e => onClickSearch(e)}>
                <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </div>
        </div> */}
    </div>
}