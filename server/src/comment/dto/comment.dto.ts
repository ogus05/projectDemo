import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class PostCommentDto{
    @IsNumber()
    reviewID: number;
    @IsString()
    @IsNotEmpty({
        message: '댓글 내용을 작성해 주세요.'
    })
    @Transform(({value}) => value?.trim())
    text: string;
    @IsBoolean()
    isOpen: boolean;

    userNumber: number;
}

export class PutCommentDto{
    @IsNumber()
    commentID: number;
    @IsString()
    text: string;

    userNumber: number;
}

export class PostLikeCommentDto{
    @IsNumber()
    commentID: number;

    userNumber: number;
}