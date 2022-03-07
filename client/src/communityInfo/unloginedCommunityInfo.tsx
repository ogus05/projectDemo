export const UnloginedCommunityInfo = () => {
    return <>
        <button>커뮤니티 찾기</button>
        <button onClick={e => location.href = '/community/page/register'}>커뮤니티 만들기</button>
    </>
}