import axios from "axios"

export const CheckLeader = async () => {
    let communityID;
    await axios.get(`/community/leader`).then(res => {
        communityID = res.data.communityID;
    }).catch(err => {
        alert("커뮤니티의 리더만 이용 가능한 페이지입니다.");
        location.href = '/';
    });
    return communityID;
}