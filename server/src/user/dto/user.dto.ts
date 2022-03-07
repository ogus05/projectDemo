import {IsString, IsEmail, IsBoolean} from 'class-validator';
export class PostUserDto {
    @IsString()
    ID: string;
    @IsString()
    nickname: string;
    @IsString()
    password: string;
    @IsEmail()
    email: string;
    acceptMail: boolean;
    @IsString()
    phone: string;
}