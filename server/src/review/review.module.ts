import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfirmMail } from "src/entities/confirmMail";
import { Review } from "src/entities/review.entity";
import { User } from "src/entities/user.entity";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { ReviewController } from "./review.controller";
import { ReviewService } from "./review.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, User, ConfirmMail]),
    UserModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
