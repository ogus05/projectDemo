import { Transform } from 'class-transformer';
import {IsString, IsEmail, Length, IsBoolean, NotContains, Max, IsNotEmpty, IsNumber, Min, IsOptional} from 'class-validator';
export class PostUserDto {
    @IsEmail({}, {
        message: "ID: 아이디 형식은 이메일입니다."
    })
    ID: string;
    @IsString()
    password: string;
    @IsString()
    @Length(3, 10, {
        message: "nickname: 닉네임은 3글자 이상 10글자 이하입니다."
    })
    @NotContains(" ", {
        message: "nickname: 닉네임에 공백은 포함될 수 없습니다."
    })
    nickname: string;
}

export class PutUserDto{
    number: number;
    @IsString({
        message: '잘못된 입력입니다.'
    })
    @Transform(({value}) => value?.trim())
    @Length(0, 100, {
        message: '상태 메시지는 공백 포함 100자 이내입니다.'
    })
    message: string;
}

export class PutPasswordDto{
    @IsEmail({}, {
        message: "ID: 아이디 형식은 이메일입니다."
    })
    ID: string;
    @IsNumber()
    number: number;
    @IsString()
    currentPassword: string;
    @IsString()
    newPassword: string;
}