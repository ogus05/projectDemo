import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { IUserEdit } from "../interfaces/user.i";
import './scss/profileEdit.scss';

export const ProfileEdit = () => {
    const [user, setUser] = useState<IUserEdit>({
        message: ' ', role: 0, nickname: '', number: 0
    });
    const [image, setImage] = useState<FileList | null>(null);
    const [imageBase64, setImageBase64] = useState<string>('');

    useEffect(() => {
        axios.get(`/user/edit`).then(res => {
            setUser(res.data);
            axios.get(`/user/image/${res.data.number}`).then(res => {
                let reader = new FileReader();
                reader.readAsDataURL(res.data);
                reader.onloadend = () => {
                    const base64 = reader.result;
                    if (base64) {
                        setImageBase64(base64.toString());
                    }
                }
            })
        })
    }, []);
    const onClickSubmit = e => {
        e.preventDefault();
        axios.put(`/user`, {
            message: user.message
        }).then(res => {
            if(image !== null){
                const fd = new FormData();
                Object.values(image).forEach(file => fd.append("image", file));
                axios.put('/user/image', fd, {
                    headers:{
                        'Content-Type': 'multipart/form-data',
                    }
                }).then(res => {
                    location.reload();
                }).catch(e => {
                    alert(e.response.data.message);
                })
            } else{
                location.reload();
            }
        })
    }
    const handleChangeFile = e => {
        e.preventDefault();
        setImage(e.target.files);
        if (e.target.files[0]) {
          let reader = new FileReader();
          reader.readAsDataURL(e.target.files[0]);
          reader.onloadend = () => {
            const base64 = reader.result;
            if (base64) {
                setImageBase64(base64.toString());
            }
        }
      }
    }
    return <div className="profileEdit">
        <div className="left">
            <p>사용자 이름</p>
                <input className="userName" type="text" value={user.nickname} onChange={e => setUser({
                    ...user,
                    nickname: e.target.value
                })} readOnly/>
            <p>상태 메시지</p>
                <textarea className="userMessage" value={user.message} onChange={e => setUser({
                    ...user,
                    message: e.target.value,
                })}/>
            <p>유저 마크</p>
            <label className="userMark" htmlFor="image">
                {
                    imageBase64 !== '' ? <img src={imageBase64}/>:
                    <img src={`/image/user/${user.number}`} onError={(e: any) => e.target.setAttribute('src', '/image/user/default')}/>
                }
                <div className="markUploadFont">
                    <FontAwesomeIcon icon={faArrowUpFromBracket}/>
                </div>
            </label>
            <input type="file" id="image" accept="image/*" onChange={handleChangeFile} style={{display: "none"}} />
        </div>
        <div className="right">
            <p></p>
        </div>
        <div className="button">
            <div className="cancle" onClick={ e => location.href = '/'}>취소</div>
            <div className="confirm" onClick={e => onClickSubmit(e)}>완료</div>
        </div>
    </div>
}