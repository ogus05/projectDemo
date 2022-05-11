export interface ICommunityInfo{
    leaderNumber: number,
    image: string,
    message: string,
    regDate: string,
}

export interface ICommunityEdit{
    name: string;
    isOpen: number;
    message: string;
}

export interface ICommunityApply{
    nickname: string;
    number: number;
}

export interface ICommunityRegister{
    name: string;
    isOpen: number;
    message: string;
}