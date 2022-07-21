import axios from "axios";
import { useEffect, useState } from "react";
import { PaginationBlock } from "../modules/paginationBlock";
import { SearchBlock } from "../modules/searchBlock";
import './scss/myCommentList.scss';

interface IMyCommentList{
    text: string;
    regDate: string;
    ID: number;
    review: {
        ID: number;
    };
}

export const MyCommentList = ({userNumber}) => {
    const [page, setPage] = useState(1);
    const [commentList, setCommentList] = useState<IMyCommentList[]>([]);
    const [commentCount, setCommentCount] = useState(0);
    const [commentToDelete, setCommentToDelete] = useState<boolean[]>([]);
    const limit = 9;
    const onClickSearch = (text: string) => {
        alert(text);
    }

    const onClickDelete = e => {
        let count = 0;
        e.preventDefault();
        commentToDelete.forEach((v, i) => {
            if(v === true) count++;
        })
        commentToDelete.forEach((v, i) => {
            if(v === true){
                count--;
                axios.delete(`/comment/${commentList[i].ID}`).then(res => {
                    if(count===0) location.reload();
                })
            }
        });
    }


    useEffect(() => {
        axios.get(`/comment/user/${userNumber}?offset=${limit * (page - 1)}&limit=${limit}`).then(res => {
            if(res.data){
                setCommentList(res.data.commentList.map((v, i) => {
                    const regDate = new Date(v.regDate);
                    v.regDate = `${regDate.getFullYear()}-${("00" + (regDate.getMonth() + 1)).slice(-2)}-${("00" + regDate.getDate()).slice(-2)}.`
                    return v
                }));
                setCommentCount(res.data.count);
                setCommentToDelete(new Array(res.data.commentList.length).fill(false));
            }
        });
    }, [page]);

    return <>{Array.isArray(commentList) && commentList.length !== 0 ? <div className="myCommentList">
        <SearchBlock onClickSearch={onClickSearch}/>
            <div className="commentList">
            {new Array(commentList.length).fill(0).map((v, i) => {
                return <Comment comment={commentList[i]} toDelete={commentToDelete[i]} setToDelete= {() => {
                    setCommentToDelete(commentToDelete.map((innerV, innerI) => {
                        if(innerI === i) return !commentToDelete[innerI];
                        return commentToDelete[innerI];
                    }))
                }} key={i}/>
            })}
        </div>
        <PaginationBlock page={page} setPage={setPage} pageCount={Math.floor(commentCount / 9) + 1}/>
        <div className="commentButton">
            <div className="checkAllButton">
                <input type="checkbox" checked={commentToDelete.every((v, i) => {return v === true})}
                onChange={e => {
                    if(commentToDelete.every((v, i) => v === true)) return setCommentToDelete(commentToDelete.map((v, i) => false));
                    else return setCommentToDelete(commentToDelete.map((v, i) => true));
                }}/>
                <div>전체 선택</div>
            </div>
            <div className="blank"></div>
            <div className="deleteButton">
                <div className="button" onClick={e => onClickDelete(e)}>
                    삭제
                </div>
            </div>
        </div>
    </div> : <div className="emptyCommentList">
                 등록된 댓글이 존재하지 않습니다.
            </div> }</>
}

const Comment = (props: {comment: IMyCommentList, toDelete: boolean, setToDelete}) => {
    return <>
        <div className="comment">
            <div className="checkbox">
                <input type="checkbox" checked={props.toDelete} onChange={e => props.setToDelete()}/>
            </div>
            <div className="commentText" onClick={e => location.href = `/review/page/info/${props.comment.review.ID}`}>
                {props.comment.text}
            </div>
            <div className="commentRegDate">
                {props.comment.regDate}
            </div>
        </div>
    </>
}