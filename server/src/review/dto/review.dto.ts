import { IsEnum, IsNumber, IsString, Max, Min } from "class-validator";
import { User } from "src/entities/user.entity";

export enum GetReviewListOrderByEnum{
    visit= 'visit',
    like= 'like',
    bookmark = 'bookmark',

}

export class GetReviewListDto{
    @IsNumber()
    @Min(0)
    @Max(100)
    limit: number;
    @IsNumber()
    @Min(0)
    offset: number;
    @IsEnum(GetReviewListOrderByEnum)
    orderBy: GetReviewListOrderByEnum;
}


export class PostReviewDto{
    @IsString()
    title: string;
    @IsString()
    text: string;
    @IsString()
    bookTitle: string;
    @IsString()
    bookCover: string;
    @IsString()
    bookAuthor: string;

    user: User;
}

export class GetReviewModel{
    
}