export interface ICommunityInfo{
    message: string,
    regDate: string,
    name: string,
    leader: {
        number: number
        nickname: string
    }
}

export interface ICommunityEdit{
    ID: number;
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

export interface ICommunitySearch{
    ID: number;
    name: string;
    message: string;
}