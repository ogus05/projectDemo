import axios from 'axios';

function jwtInterceptor() {
    const instance = axios.create();
    instance.defaults.validateStatus = status => status < 500;

    instance.interceptors.response.use(async res => {
        //refreshtoken이 만료됐을때
        if(res.status === 403){
            alert(res.data.message);
            location.href = '/';
        }
        //권한이 충족되지 않았을 때
        else if(res.status === 401){
            alert(res.data.message);
            location.href = '/';
        }
        //refreshToken이 만료 안되었을 때, accessToken이 만료되었을때
        //(accessToken 재발급)
        else if(res.status === 202){
            alert("다시 시도해 주세요.");
            const data = await instance.request(res.request.config);
            return data;
        }
        //둘다 만료되지 않은 정상 요청이나 기타 다른 오류가 있을 때
        else{
            return res;
        }
    });
    return instance;
}

export default jwtInterceptor();