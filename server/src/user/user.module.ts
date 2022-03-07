import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { AuthModule } from "src/auth/auth.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { Profile } from "src/entities/profile.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile])
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule{
    
}