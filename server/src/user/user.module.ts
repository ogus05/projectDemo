import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { MulterModule } from "@nestjs/platform-express";
import { ConfigModule, ConfigService } from "@nestjs/config";
import {diskStorage} from "multer";
import { CommunityService } from "src/community/community.service";
import { Community } from "src/entities/community.entity";
import { MailModule } from "src/mail/mail.module";
import { MailService } from "src/mail/mail.service";
import { ConfirmMail } from "src/entities/confirmMail";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Community, ConfirmMail]),
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
        }),
    ],
    providers: [UserService, MailService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule{
    
}