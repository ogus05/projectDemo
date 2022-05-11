export interface IUserEdit{
    ID: string;
    nickname: string;
    message: string;
    phone: string;
    birth: string;
    male: boolean;
    acceptMail: boolean;
    communityID: number;
    role: number;
}

export interface IUserInfo{
    nickname: string;
    regDate: string;
    message: string;
    birth: string;
    male: boolean;
}

export interface IUser{
    number: number;
    nickname: string;
    communityID: number;
    role: number;
}