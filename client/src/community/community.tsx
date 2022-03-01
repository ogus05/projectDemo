import ReactDOM from 'react-dom';
import Header from '../modules/header';
import { ReviewList } from '../main/reviewList';

const Community = () => {
    return <>
        <Header />
        <ReviewList listName='소속 커뮤니티 인기 리뷰' url='/'/>
        <ReviewList listName='소속 커뮤니티 최신 리뷰' url='/'/>
        <ReviewList listName='커뮤니티에 내가 쓴 리뷰' url='/'/>
    </>
}


ReactDOM.render(<Community/>, document.querySelector('#main'));
