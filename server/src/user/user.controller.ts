import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query, Render, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
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


    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(@Req() req: Request, @Res() res: Response){
        const user = await this.userService.getUserByNumber(req.user.number, false);
        res.send(user);
    }

    @Get('edit')
    @UseGuards(JwtAuthGuard)
    async getUserEditInfo(@Req() req: Request, @Res() res: Response){
        const user = await this.userService.getUserByNumber(req.user.number, false, 2);
        res.send(user);
    }

    @Get('info/:Number')
    @UseGuards(JwtAuthGuard)
    async getUserInfo(@Param('Number') number: number, @Req() req: Request, @Res() res: Response){
        if(isNaN(number)) number = req.user.number;
        const user = await this.userService.getUserByNumber(number, false);
        if(!user) throw new BadRequestException("존재하지 않는 유저입니다.");
        res.send(user);
    }

    @Post()
    @HttpCode(201)
    async postUser(@Body() body: PostUserDto, @Req() req: Request, @Res() res: Response){
        const user = await this.userService.createUser(body);
        const token = await this.userService.createConfirmMail(user.ID, 0);
        this.mailService.sendUserConfirmation(token, body.ID);
        res.send();
    }

    @Put()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async putUser(@Body() body: PutUserDto, @Req() req: Request, @Res() res: Response){
        body.number = req.user.number;
        await this.userService.updateUser(body);
        res.send();
    }

    @Put('image')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async putUserImage(@UploadedFile() image: Express.Multer.File, @Req() req: Request, @Res() res: Response){
        await this.userService.updateUserImage(req.user.number, image.filename);
        res.send();
    }

    @Put('password')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async putUserPassword(@Body() body: PutPasswordDto, @Req() req: Request, @Res() res: Response){
        await this.userService.updateUserPassword(body);
        res.send();
    }

    @Patch('password')
    @HttpCode(201)
    async patchUserPassword(@Body() body: PutPasswordDto, @Req() req: Request, @Res() res: Response){
        body.currentPassword = this.configService.get("EDIT_PASSWORD");
        await this.userService.deleteConfirmMail(body.ID);
        await this.userService.updateUserPassword(body);
        res.send();
    }

    @Delete()
    @UseGuards(JwtAuthGuard)
    async deleteUser(@Req() req: Request, @Res() res: Response){
        await this.userService.deleteUser(req.user.number);
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
        if(!data){
            throw new NotFoundException("잘못된 요청입니다.");
        }
        let view = '';
        if(data.type === 0) {
            view = "confirmRegister";
            await this.userService.setUserRole(data.user.ID, UserRole.CERTIFIED);
        }  else if(data.type === 1){
            view = "passwordEdit";
            await this.userService.updateUserPassword({
                ID: data.user.ID,
                currentPassword: '',
                newPassword: this.configService.get("EDIT_PASSWORD")
            });
        }
        res.render(view);
    }

    @Post('confirm')
    async postConfirmMail(@Query('type') type: number, @Body('userID') userID: string, @Req() req: Request, @Res() res: Response){
        const token = await this.userService.createConfirmMail(userID, type);
        this.mailService.sendUserConfirmation(token, userID);
        res.send();
    }

    @Get('/token/:Token')
    async getUserIDByToken(@Param("Token") token: string, @Req() req: Request, @Res() res: Response){
        const confirmMail = await this.userService.getConfirmMail(token);
        if(!confirmMail) throw new BadRequestException("잘못된 요청입니다.");
        res.send({userID: confirmMail.user.ID});
    }
    
    @Get('/page/register')
    @Render('userRegister')
    async getUserRegisterPage(){
    }

    @Get('/page/info')
    @UseGuards(JwtAuthGuard)
    async redirectMyPage(@Req() req: Request, @Res() res: Response){
        res.redirect(`/user/page/info/${req.user.number}`);
    }

    @Get('/page/info/:Number')
    @UseGuards(JwtAuthGuard)
    async getUserPage(@Param('Number') number: number, @Req() req: Request, @Res() res: Response){
        if(isNaN(number)) res.redirect(`/user/page/info/${req.user.number}`);
        else{
            res.render('userInfo', {
                number,
            });
        }
    }

    @Get('/page/help')
    @Render('userHelp')
    async getUserHelpPage(){
    }

    @Get('/page/edit')
    @Render('userEdit')
    @UseGuards(JwtAuthGuard)
    async getUserEditPage(@Req() req: Request){
    }

    @Get('/page/delete')
    @Render('userDelete')
    @UseGuards(JwtAuthGuard)
    async getUserDeletePage(){}
}