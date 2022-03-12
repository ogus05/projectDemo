import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch()
export class ErrorFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
        if(exception instanceof HttpException){
            throw exception
        } else{
            console.log(exception);
            throw new HttpException("잠시 후 다시 시도해주세요.", 500);
        }
    }
}