import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [

    ],
    providers: [UserService],
    exports: [],
    controllers: [UserController]
})
export class UserModule{
    
}