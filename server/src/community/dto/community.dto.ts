import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Length, Max, Min } from "class-validator";

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
    @IsString({
        message: '잘못된 입력입니다.'
    })
    @Transform(({value}) => value?.trim())
    @Length(0, 100, {
        message: '소개 메시지는 공백 포함 100자 이내입니다.'
    })
    @IsNotEmpty({
        message: "커뮤니티 소개 메시지는 필수입니다."
    })
    message: string;

    leaderNumber: number;
}

export class PutCommunityDto{
    ID: number;
    @IsString({
        message: '잘못된 입력입니다.'
    })
    @Transform(({value}) => value?.trim())
    @IsNotEmpty({
        message: '잘못된 입력입니다.'
    })
    @Length(3, 10, {
        message: '커뮤니티 이름은 3자 이상 10자 이하입니다.'
    })
    name: string;
    @IsNumber()
    @Max(1)
    @Min(0)
    isOpen: number;
    @IsString({
        message: '잘못된 입력입니다.'
    })
    @Transform(({value}) => value?.trim())
    @Length(0, 100, {
        message: '소개 메시지는 공백 포함 100자 이내입니다.'
    })
    @IsNotEmpty({
        message: "커뮤니티 소개 메시지는 필수입니다."
    })
    message: string;
}

export class ApplyCommunityDto{
    ID: number;
    userNumber: number;
}