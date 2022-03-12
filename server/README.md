# Page Location.
- /. 첫 화면
- /main. 메인 화면
- /user/register. 회원가입 화면
- /user/help. 아이디/비밀번호 찾기 화면
- /user/info. 내 정보 화면
- /user/edit. 개인 정보 수정 화면.

- /community/register. 커뮤니티 생성 화면.
- /community/search. 커뮤니티 찾기 화면.
- /community/info. 커뮤니티 정보 화면.

- /review/register. 리뷰 생성 화면
- /review/page/:ID. 리뷰 화면.


# 궁금.
- 유저에 커뮤니티ID가 들어갔고, 커뮤니티에는 유저 정보를 저장을 하지 않는다. 그런데 만약 커뮤니티를 select할 때 유저 수를 가져오기 위해서는 
1. 유저를 먼저 communityID의 Count만 select하고 그 값을 오름차 순으로 orderBy한다음, offset, limit으로 잘라진 Community만 가져오는 방법이 있고
2. Community에 userCount를 넣어서 유저가 가입/탈퇴 할 때마다 더하거나 빼주면서 단순히 community를 userCount를 이용해 orderBy시키는 방법이 있다.