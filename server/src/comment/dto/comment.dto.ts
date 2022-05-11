import { IsNumber, IsString } from "class-validator";

export class PostCommentDto{
    @IsNumber()
    reviewID: number;
    @IsString()
    text: string;

    userNumber: number;
}

export class PutCommentDto{
    @IsNumber()
    commentID: number;
    @IsString()
    text: string;

    userNumber: number;
}

export class DeleteCommentDto{
    @IsNumber()
    commentID: number;

    userNumber: number;
}

export class LikeCommentDto{
    @IsNumber()
    commentID: number;

    userNumber: number;
}