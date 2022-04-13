import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { AccessTokenException, RefreshTokenException } from "./token.e";

@Catch(AccessTokenException)
export class AccessTokenExceptionFilter implements ExceptionFilter{
    catch(exception: AccessTokenException, host: ArgumentsHost){
        const req: Request = host.switchToHttp().getRequest();
        const res: Response = host.switchToHttp().getResponse();
        res.redirect(`/auth/jwt?location=${req.url}&method=${req.method}`);
    }
}

@Catch(RefreshTokenException)
export class RefreshTokenExceptionFilter implements ExceptionFilter{
    constructor(private config: ConfigService){}
    catch(exception: RefreshTokenException, host: ArgumentsHost){
        const res: Response = host.switchToHttp().getResponse();
        res.clearCookie(this.config.get("ACCESS_JWT"))
        .clearCookie(this.config.get("REFRESH_JWT"), {path:"/auth/jwt"})
        .redirect('/');
    }
}