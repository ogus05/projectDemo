import { IsBoolean, IsString } from "class-validator";
import { User } from "src/entities/user.entity";

export class GetCommunityListDto{
    offset: number;
    limit: number;
    orderBy: string;
}


export class PostCommunityDto{
    @IsString()
    name: string;
    @IsBoolean()
    isOpen: boolean;
    @IsString()
    message: string;

    leaderID: string;
}

export class PutCommunityDto{
    ID: number;
    @IsBoolean()
    isOpen: boolean;
    @IsString()
    message: string;
}