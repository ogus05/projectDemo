import { Controller, Get, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController{
    constructor(
        authService: AuthService
    ){}

    @Get()
    async getAuth(){

    }

    @Post()
    async postAuth(){
        
    }
}