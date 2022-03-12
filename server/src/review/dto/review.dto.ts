import { IsEnum, IsNumber, IsString, Max, Min } from "class-validator";
import { User } from "src/entities/user.entity";


export class GetReviewListDto{
    limit: string;
    offset: string;
    orderBy: string;
    where: string;
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