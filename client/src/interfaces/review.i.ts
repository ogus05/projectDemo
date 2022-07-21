export interface IReviewInfo{
    ID: number;
    title: string;
    text: string;
    user:{
        nickname: string;
        number: number;
    }
    regDate: string;
}

export interface IReviewCommentInfo{
    ID: number;
    user: {
        number: string,
        nickname: string
    }
    regDate: string;
    text: string;
    isOpen: boolean;
}

export interface IReviewList {
    ID: number;
    ISBN: string;
    title: string;
    user: {
        nickname: string;
    };
    community: {
        name: string;
    }
    regDate: string;

}
