import { HttpException, HttpStatus } from "@nestjs/common";

export class AccessTokenException extends HttpException{
    constructor(message: String= 'Access Token has Expired'){
        super(message, HttpStatus.UNAUTHORIZED);
    }
}

export class RefreshTokenException extends HttpException{
    constructor(message: String= 'Refresh Token has Expired'){
        super({message}, HttpStatus.UNAUTHORIZED);
    }
}