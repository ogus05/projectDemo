export interface IUserEdit{
    message: string;
    role: number;
    nickname: string;
    number: number;
}

export interface IUserInfo{
    nickname: string;
    regDate: string;
    message: string;
    birth: string;
    male: boolean;
}

export interface IUserCommunityInfo{
    number: number;
    nickname: string;
    communityID: number;
}

export interface IUserConfirmInfo{
    type: number,
    nickname: string,
    userNumber: number,
}