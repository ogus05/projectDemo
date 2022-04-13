import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class ErrorFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
        const res: Response = host.switchToHttp().getResponse();
        if(exception instanceof HttpException){
        } else{
            res.status(404).json({
                message: "잠시 후 다시 시도해 주세요."
            })
        }
    }
}