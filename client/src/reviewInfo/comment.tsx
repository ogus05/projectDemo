import axios from 'axios';
import { useEffect, useState } from 'react';
import {IReviewCommentInfo} from '../interfaces/review.i';
import './scss/comment.scss';

export const Comment = (props: {reviewID: number}) => {
    const [commentList, setCommentList] = useState<IReviewCommentInfo[]>([]);
    const [text, setText] = useState('');
    const [isOpen, setIsOpen] = useState(true);
    useEffect(() => {
        axios.get(`/comment/review/${props.reviewID}`).then(res => {
            setCommentList(res.data.commentList.map((v, i) => {
                const regDate = new Date(v.regDate);
                v.regDate = `${regDate.getFullYear()}.${("00" + (regDate.getMonth() + 1)).slice(-2)}.${("00" + regDate.getDate()).slice(-2)}`
                return v;
            }));
        })
    }, []);

    const onClickUpload = e => {
        e.preventDefault();
        axios.post('/comment',{
            reviewID: props.reviewID, text, isOpen
        }).then(res => {
            location.reload();
        }).catch(err => {
            if(err.response.data.status > 499 || !err.response.data.message){
                alert('일시적인 오류입니다 다시 시도해 주세요.');
            } else{
                alert(err.response.data.message);
            }
            location.reload();
        })
    }

    return <div className="comment">
        <div className="commentWrite">
            <div className="text">
                댓글쓰기
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)}/>
            <div className='buttonBlock'>
                <div className="isOpenButton">
                    <input type="checkbox" checked={!isOpen} onChange={e => setIsOpen(!isOpen)}/>
                    비공개
                </div>
                <div className="uploadButton">
                    <div className="block" onClick={e => onClickUpload(e)}>
                        등록
                    </div>
                </div>
            </div>
        </div>
        {
            Array.isArray(commentList) && commentList.length !== 0 ? 
            <div className="commentView">
                <div className="text">
                    댓글
                </div>
                <div className="commentList">
                    {commentList.map((v, i) => <CommentInfo comment={v} key={i}/>)}
                </div>
            </div>: <div className='emptyCommentList'>
                댓글이 존재하지 않습니다.
            </div>
        }
    </div>
}

const CommentInfo = (props: {comment: IReviewCommentInfo}) => {
    const onClickDelete = e => {
        e.preventDefault();
        axios.delete(`/comment/${props.comment.ID}`).then(res => {
            location.reload();
        }).catch(err => {
            if(err.response.status > 499 || !err.response.data.message){
                alert("일시적인 오류입니다 다시 시도해주세요.");
            } else{
                alert(err.response.data.message);
            }
            location.reload();
        })
    }
    return <div className="commentInfo">
        <div className="left">
            <img src={`/image/user/${props.comment.user.number}`} onError={(e: any) => e.target.setAttribute('src', '/image/user/default')}/>
        </div>
        <div className="right">
            <div className="userName">
                {props.comment.user.nickname}
            </div>
            <div className="commentText">
                {props.comment.text}
            </div>
            <div className="regDate">
                {props.comment.regDate}
            </div>

        </div>
    </div>

}