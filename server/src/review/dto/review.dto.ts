import { IsEnum, IsNumber, IsString, Max, Min } from "class-validator";
import { User } from "src/entities/user.entity";

export class GetReviewListDto{
    limit: number;
    offset: number;
    orderBy: string;
    where: string;
}


export class PostReviewDto{
    @IsString()
    category: string;
    @IsString()
    title: string;
    @IsString()
    text: string;
    @IsNumber()
    ISBN: string;

    userNumber: number;
}

export class PutReviewDto{
    @IsNumber()
    reviewID: number;
    @IsString()
    title: string;
    @IsString()
    text: string;

    userNumber: number;
}

export class DeleteReviewDto{
    @IsNumber()
    reviewID: number;

    userNumber: number;
}
