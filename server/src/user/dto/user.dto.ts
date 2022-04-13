import {IsString, IsEmail, IsNotEmpty, Min, Max, MaxLength, Length, IsDate, IsBoolean, IsNumber, MAX, max, IsPhoneNumber, IsOptional} from 'class-validator';
export class PostUserDto {
    @IsEmail({}, {
        message: "아이디 형식은 이메일입니다."
    })
    ID: string;
    @IsString()
    password: string;
    @IsString()
    @Length(3, 10, {
        message: "닉네임은 3글자 이상 10글자 이하입니다."
    })
    nickname: string;
}

export class PutUserDto{
    ID: string;
    @IsString()
    @Length(3, 10, {
        message: "닉네임은 3글자 이상 10글자 이하입니다."
    })
    nickname: string;
    @IsString()
    message: string;
    @IsNumber()
    @Max(1)
    @Min(0)
    acceptMail: boolean;
}


export class PutPasswordDto{
    @IsEmail()
    @IsOptional()
    ID: string;
    @IsString()
    currentPassword: string;
    @IsString()
    newPassword: string;
}