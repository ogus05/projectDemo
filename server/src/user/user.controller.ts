import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Patch, Post, Put, Render, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { PostUserDto, UpdateUserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController{
    constructor(
        private userService: UserService,
        private configService: ConfigService
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

    @Get('/page/cancle')
    @Render('userCancle')
    @UseGuards(JwtAuthGuard)
    async getUserCanclePage(){}

    @Post()
    async postUser(@Body() body: PostUserDto){
        try{
            if(await this.userService.getUserByID(body.ID, false, false)){
                throw new HttpException("duplicate ID", HttpStatus.BAD_REQUEST);
            }
            await this.userService.createUser(body);
        } catch(e){
            if(e instanceof HttpException) throw e;
            else{
                console.log(e);
                throw new HttpException("잠시 후 다시 시도해주세요.", 500);
            }
        }
    }

    @Put()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async putUser(@Body() body: UpdateUserDto, @Req() req: Request, @Res() res: Response){
        try{
            body.ID = req.user.userID;
            await this.userService.updateUser(body);
            res.send();
        } catch(e){
            if(e instanceof HttpException) throw e;
            else{
                console.log(e);
                throw new HttpException("잠시 후 다시 시도해주세요.", 500);
            }
        }
    }

    @Put()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('photo'))
    async putUserImage(@UploadedFile() photo: Express.Multer.File, @Req() req: Request, @Res() res: Response){
        try{
            
            await this.userService.updateUserImage(req.user.userID, photo.filename);
            res.send();
        } catch(e){
            if(e instanceof HttpException) throw e;
            else {
                console.log(e)
                throw new HttpException('잠시 후 다시 시도해주세요.', 500);
            }
        }


    }
}