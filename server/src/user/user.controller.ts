import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post, Put, Query, Render, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { UserRole } from "src/auth/roles/roles";
import { JWTInterceptor } from "src/interceptors/JWT.interceptor";
import { MailService } from "src/mail/mail.service";
import { PostUserDto, PutPasswordDto, PutUserDto } from "./dto/user.dto";
import { UserService } from "./user.service";

@Controller('user')
export class UserController{
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        private mailService: MailService,
    ){}
    

    @Get('info')
    @UseInterceptors(JWTInterceptor)
    async getUserInfo(@Req() req: Request, @Res() res: Response){
        const user = await this.userService.getUserByID(req.user.userID, false, false);
        res.send(user);
    }

    @Post()
    @HttpCode(201)
    async postUser(@Body() body: PostUserDto, @Req() req: Request, @Res() res: Response){
        await this.userService.createUser(body);
        const token = await this.userService.createConfirmMail(body.ID, 0);
        this.mailService.sendUserConfirmation(token, body.ID, body.nickname);
        res.send();
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

    @Patch('password')
    @HttpCode(201)
    async patchUserPassword(@Body() body: PutPasswordDto, @Req() req: Request, @Res() res: Response){
        await this.userService.updateUserPassword(body);
        res.send();
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Req() req: Request, @Res() res: Response){
        await this.userService.deleteUser(req.user.userID);
        res.clearCookie(this.configService.get("ACCESS_JWT"), {
            sameSite: 'lax',
        }).clearCookie(this.configService.get("REFRESH_JWT"), {
            path: '/auth/jwt',
            sameSite: 'lax',
        }).
        send();
    }

    
    @Get('confirm')
    async getConfirmMail(@Query('token') token, @Req() req: Request, @Res() res: Response){
        const data = await this.userService.getConfirmMail(token);
        let view = '';
        if(data.type === 0) {
            view = "confirmRegister";
            await this.userService.setUserRole(data.userID, UserRole.CERTIFIED);
            await this.userService.deleteConfirmMail(token);
        }  else if(data.type === 1){
            view = "passwordEdit";
            await this.userService.updateUserPassword({
                ID: data.userID,
                currentPassword: '',
                newPassword: this.configService.get("EDIT_PASSWORD")
            });
        }
        res.render(view, {
            userID: data.userID,
            token,
        });
    }

    @Post('confirm')
    async postConfirmMail(@Query('type') type: number, @Body() body, @Req() req: Request, @Res() res: Response){
        const user = await this.userService.getUserByID(body.userID, false, false);
        if(!user) throw new BadRequestException("존재하지 않는 이메일입니다.");
        const token = await this.userService.createConfirmMail(body.userID, type);
        this.mailService.sendUserConfirmation(token, body.userID, user.nickname);
        res.send();
    }
    
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
    async getUserEditPage(@Req() req: Request){
        return {userID: req.user.userID}
    }

    @Get('/page/delete')
    @Render('userDelete')
    @UseGuards(JwtAuthGuard)
    async getUserDeletePage(){}

    @Get(':ID')
    @UseGuards(JwtAuthGuard)
    async getUser(@Param('ID') ID: string, @Req() req: Request, @Res() res: Response){
        if(ID === undefined) ID = req.user.userID;
        const user = await this.userService.getUserByID(ID, false, true);
        if(!user) throw new BadRequestException("존재하지 않는 유저입니다.");
        res.send(user);
    }
}