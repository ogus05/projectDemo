import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class GetCommunityListDto{
    offset: number;
    limit: number;
    orderBy: string;
}


export class PostCommunityDto{
    @IsString()
    name: string;
    @IsNumber()
    @Max(1)
    @Min(0)
    isOpen: number;
    @IsString()
    @IsNotEmpty({
        message: "커뮤니티 소개 메시지는 필수입니다."
    })
    message: string;

    leaderNumber: number;
}

export class PutCommunityDto{
    ID: number;
    @IsNumber()
    @Max(1)
    @Min(0)
    isOpen: number;
    @IsString()
    message: string;
}

export class ApplyCommunityDto{
    @IsNumber()
    ID: number;
    number: number;
}