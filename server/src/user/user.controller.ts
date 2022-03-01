import { Controller, Get, Post } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller('user')
export class UserController{
    constructor(
        userService: UserService
    ){}

    @Post()
    async postUser(){
        //유저 회원가입
    }


}