import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt-auth.strategy";
import { JwtRefreshStrategy } from "./strategy/jwt-refresh.strategy";
import { LocalStrategy } from "./strategy/local.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.register({
            secret: 'develope'
        }),
        UserModule
    ],
    providers: [
        AuthService,
        LocalStrategy, JwtStrategy, JwtRefreshStrategy
    ],
    exports: [
        AuthService
    ],
    controllers: [AuthController]
})
export class AuthModule{
    
}