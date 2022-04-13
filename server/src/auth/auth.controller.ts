import { All, BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpException, Post, Put, Req, Res, UseFilters, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";
import { JwtRefreshGuard } from "./guard/jwt-refresh.guard";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { RefreshTokenExceptionFilter } from "./exceptions/token.f";

@Controller('auth')
export class AuthController{
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ){
        this.handleRefreshToken = authService.handleRefreshToken();
    }
    private handleRefreshToken;

    @Post()
    @HttpCode(201)
    @UseGuards(LocalAuthGuard)
    async postAuth(@Req() req: Request, @Res() res: Response){
        try{
            const refreshToken = await this.handleRefreshToken.issueToken(req.user);
            const accessToken = await this.authService.issueAccessToken(req.user);
            res.cookie(this.configService.get("ACCESS_JWT"), accessToken, {
                sameSite: 'lax'
            }).cookie(this.configService.get("REFRESH_JWT"), refreshToken, {
                path: '/auth/jwt',
                sameSite: 'lax',
            }).send();
        } catch(e){
            try{
                await this.handleRefreshToken.deleteToken(req.user);
            } catch(e){}
            console.log(e);
            throw new BadRequestException("로그인 도중 오류가 발생했습니다.");
        }
    }

    @Delete()
    @HttpCode(201)
    @UseGuards(JwtAuthGuard)
    async deleteAuth(@Req() req: Request, @Res() res: Response){
        await this.handleRefreshToken.deleteToken(req.user);
        res.clearCookie(this.configService.get("ACCESS_JWT"))
        .clearCookie(this.configService.get("REFRESH_JWT")).send();
    }

    @All('/jwt')
    @UseGuards(JwtRefreshGuard)
    @UseFilters(RefreshTokenExceptionFilter)
    async issueAccessToken(@Req() req: Request, @Res() res: Response){
        const accessToken = await this.authService.issueAccessToken(req.user);
        res.cookie(this.configService.get("ACCESS_JWT"), accessToken, {
            sameSite: 'lax'
        }).redirect(req.query.location as string);
    }

}