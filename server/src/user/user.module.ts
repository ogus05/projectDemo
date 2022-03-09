import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {diskStorage} from "multer";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                storage: diskStorage({
                    destination: configService.get("MULTER_DEST"),
                    filename: (req, file, cb) => {
                        const filename = (new Date()).getTime() + "_" + req.user.userID + ".jpeg";
                        cb(null, filename);
                    }
                })
            }),
            inject: [ConfigService]
        })
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule{
    
}