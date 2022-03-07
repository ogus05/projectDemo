import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Render, Req, Res, UseGuards } from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PostUserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController{
    constructor(
        private userService: UserService
    ){}

    @Get('/page/register')
    @Render('userRegister')
    async getUserRegisterPage(){
    }

    @Get('/page/info')
    @Render('userInfo')
    @UseGuards(JwtAuthGuard)
    async getUserPage(@Req() req: Request){
        return {nickname: req.user.nickname};
    }

    @Get('/page/help')
    @Render('userHelp')
    async getUserHelpPage(){

    }

    @Get('/page/edit')
    @Render('userEdit')
    @UseGuards(JwtAuthGuard)
    async getUserEditPage(){}

    @Post()
    async postUser(@Body() postUserDto: PostUserDto){
        try{
        if(await this.userService.getUserByID(postUserDto.ID)){
            throw new HttpException("duplicate ID", HttpStatus.BAD_REQUEST);
        }
        await this.userService.createUser(postUserDto);
        } catch(e){
            console.log(e);
            throw new HttpException("잠시 후 다시 시도해주세요.", 500);
        }
        
    }


}