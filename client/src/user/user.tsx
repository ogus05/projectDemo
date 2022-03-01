import ReactDOM from 'react-dom'
import { ReviewList } from '../main/reviewList';
import Header from '../modules/header';
const User = () => {
    return <>
        <Header />
        <h3>유저님 안녕하세요!</h3>
        <div>개인정보 수정하기</div>
        <div>가입 커뮤니티 정보 확인</div>
        <ReviewList listName='좋아요한 리뷰' url='/'/>
        <ReviewList listName='내가 쓴 리뷰' url='/'/>
    </>
}

ReactDOM.render(<User/>, document.querySelector("#main"));
