import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Put, Query, Render, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request, Response } from "express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles, UserRole } from "src/auth/roles/roles";
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

    @Get('edit')
    @UseGuards(JwtAuthGuard)
    async getUserEditInfo(@Req() req: Request, @Res() res: Response){
        const user = await this.userService.getUserEdit(req.user.number);
        res.send(user);
    }

    @Get('info/:Number')
    @UseGuards(JwtAuthGuard)
    async getUserInfo(@Param('Number') number: number, @Req() req: Request, @Res() res: Response){
        if(isNaN(number)) number = req.user.number;
        const user = await this.userService.getUserInfo(number);
        if(!user) throw new BadRequestException("존재하지 않는 유저입니다.");
        res.send(user);
    }

    @Get('community/info')
    @UseGuards(JwtAuthGuard)
    async getUserCommunityInfo(@Req() req: Request, @Res() res: Response){
        const user = await this.userService.getUserCommunityInfo(req.user.number);
        if(!user) throw new BadRequestException("존재하지 않는 유저입니다.");
        res.send(user);
    }

    @Get('confirm/:token')
    async getUserConfirmInfo(@Param('token') token: string, @Req() req: Request, @Res() res: Response){
        const confirmInfo = await this.userService.getConfirmMail(token);
        if(!confirmInfo) throw new BadRequestException(["token: 잘못된 토큰입니다."]);
        if(confirmInfo.type === 0){
            await this.userService.updateUserRole(confirmInfo.userNumber, 1);
            await this.userService.deleteConfirmMail(confirmInfo.userNumber);
        } else if(confirmInfo.type === 1){
        }
        res.send({
            type: confirmInfo.type,
            nickname: confirmInfo.user.nickname,
            userNumber: confirmInfo.userNumber
        });
    }

    //회원가입
    @Post()
    @HttpCode(201)
    async postUser(@Body() body: PostUserDto, @Req() req: Request, @Res() res: Response){
        if((await this.userService.checkUserDuplicate(body.ID))){
            throw new BadRequestException(["ID: 이미 존재하는 이메일입니다."]);
        }
        const user = await this.userService.createUser(body);
        const {token} = await this.userService.createConfirmMail(user.ID, 0);
        this.mailService.sendUserConfirmation(token, 0, user.ID, user.nickname);
        res.send();
    }

    //업데이트유저
    @Put()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async putUser(@Body() body: PutUserDto, @Req() req: Request, @Res() res: Response){
        body.number = req.user.number;
        await this.userService.updateUser(body);
        res.send();
    }

    //업데이트유저이미지
    @Put('image')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    async putUserImage(@UploadedFile() image: Express.Multer.File, @Req() req: Request, @Res() res: Response){
        res.send();
    }

    //업데이트 유저 비밀번호(앎)
    @Put('password')
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async putUserPassword(@Body() body: PutPasswordDto, @Req() req: Request, @Res() res: Response){
        await this.userService.updateUserPassword(body);
        res.send();
    }

    //업데이트 유저 비밀번호(모름)
    @Patch('password')
    @HttpCode(201)
    async patchUserPassword(@Body() body: PutPasswordDto, @Req() req: Request, @Res() res: Response){
        body.currentPassword = this.configService.get("EDIT_PASSWORD");
        await this.userService.deleteConfirmMail(body.number);
        await this.userService.updateUserPassword(body);
        res.send();
    }

    //회원탈퇴
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

    //confirmMail 생성
    @Post('confirm')
    @HttpCode(201)
    async postConfirmMail(@Body('type') type: number, @Body('ID') ID: string, @Req() req: Request, @Res() res: Response){
        const {user, token} = await this.userService.createConfirmMail(ID, type);
        this.mailService.sendUserConfirmation(token, type, user.ID, user.nickname);
        await this.userService.updateUserPassword({
            ID: user.ID,
            currentPassword: '',
            number: user.number,
            newPassword: this.configService.get("EDIT_PASSWORD"),
        })
        res.send();
    }

    @Get('/page/confirm')
    @Render('confirm')
    async getConfirmMail(){
    }
    
    @Get('/page/register')
    @Render('userRegister')
    async getUserRegisterPage(){
    }

    @Get('/page/login')
    @Render('userLogin')
    async getUserLogin(){
        
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

    @Get('/page/edit')
    @Render('userEdit')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(1)
    async getUserEditPage(){
    }

    @Get('/page/delete')
    @Render('userDelete')
    @UseGuards(JwtAuthGuard)
    async getUserDeletePage(){}
}