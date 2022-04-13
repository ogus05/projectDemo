import { IsNumber, IsString } from "class-validator";

export class PostCommentDto{
    @IsNumber()
    reviewID: number;
    @IsString()
    text: string;

    userID: string;
}

export class PutCommentDto{
    @IsNumber()
    commentID: number;
    @IsString()
    text: string;

    userID: string;
}

export class DeleteCommentDto{
    @IsNumber()
    commentID: number;

    userID: string;
}

export class LikeCommentDto{
    @IsNumber()
    commentID: number;

    userID: string;
}