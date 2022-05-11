import {IsString, IsEmail, IsNotEmpty, Min, Max, MaxLength, Length, IsDate, IsBoolean, IsNumber, MAX, max, IsPhoneNumber, IsOptional, Validate, ValidateIf, Contains, NotContains} from 'class-validator';
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
    @NotContains(" ", {
        message: "닉네임에 공백은 포함될 수 없습니다."
    })
    nickname: string;
}

export class PutUserDto{
    number: number;
    @IsString()
    @Length(3, 10, {
        message: "닉네임은 3글자 이상 10글자 이하입니다."
    })
    @NotContains(" ", {
        message: "닉네임에 공백은 포함될 수 없습니다."
    })
    nickname: string;
    @IsString()
    message: string;
    @IsBoolean()
    acceptMail: boolean;
}


export class PutPasswordDto{
    @IsString()
    ID: string;
    @IsString()
    currentPassword: string;
    @IsString()
    newPassword: string;
}