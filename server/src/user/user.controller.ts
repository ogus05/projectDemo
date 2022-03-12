import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, Render, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { CommunityService } from "src/community/community.service";
import { PostUserDto, PutPasswordDto, PutUserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController{
    constructor(
        private userService: UserService,
        private readonly communityService: CommunityService,
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

    @Get('/page/delete')
    @Render('userCancle')
    @UseGuards(JwtAuthGuard)
    async getUserCanclePage(){}

    @Get()
    @Get(':ID')
    @UseGuards(JwtAuthGuard)
    async getUser(@Param('ID') ID: string, @Req() req: Request, @Res() res: Response){
        if(ID === undefined) ID = req.user.userID;
        const user = await this.userService.getUserByID(ID, false, false);
        if(!user) throw new BadRequestException("존재하지 않는 유저입니다.");
        res.send(user);
    }

    @Post()
    async postUser(@Body() body: PostUserDto){
        await this.userService.createUser(body);
    }

    @Put()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async putUser(@Body() body: PutUserDto, @Req() req: Request, @Res() res: Response){
        body.ID = req.user.userID;
        await this.userService.updateUser(body);
        res.send();
    }

    @Put('image')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async putUserImage(@UploadedFile() image: Express.Multer.File, @Req() req: Request, @Res() res: Response){
        await this.userService.updateUserImage(req.user.userID, image.filename);
        res.send();
    }

    @Put('password')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async putUserPassword(@Body() body: PutPasswordDto, @Req() req: Request, @Res() res: Response){
        body.ID = req.user.userID;
        await this.userService.updateUserPassword(body);
        res.send();
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Req() req: Request, @Res() res: Response){
        await this.userService.deleteUser(req.user.userID);
        res.send();
    }

    @Delete('community')
    @UseGuards(JwtAuthGuard)
    async deleteCommunity(@Req() req: Request, @Res() res: Response){
        await this.communityService.updateCommunityUser(req.user.userID);
        res.send();
    }
}