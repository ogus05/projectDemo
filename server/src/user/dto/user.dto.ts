import {IsString, IsEmail, IsBoolean} from 'class-validator';
export class PostUserDto {
    @IsString()
    ID: string;
    @IsString()
    password: string;
    @IsString()
    nickname: string;
    @IsString()
    phone: string;
    @IsEmail()
    email: string;
    @IsString()
    message: string;
}

export class PutUserDto{
    ID: string;
    @IsString()
    nickname: string;
    @IsEmail()
    email: string;
    @IsString()
    phone: string;
    @IsString()
    message: string;
}


export class PutPasswordDto{
    ID: string
    @IsString()
    password: string;
    @IsString()
    newPassword: string;
}