import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "src/entities/review.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";
import { DeleteReviewDto, GetReviewListDto, PostReviewDto, PutReviewDto } from "./dto/review.dto";

@Injectable()
export class ReviewService{
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        private readonly userService: UserService,
    ){}

    async getReviewByID(reviewID: number){
        const review = await this.reviewRepository.createQueryBuilder('review')
        .select(["review.title", "review.text", "review.visit", "review.userID", "review.book_title",
        "review.book_cover", "review.book_author"])
        .where("ID = :keyReviewID", {keyReviewID: reviewID})
        .getOne();
        return review;
    }


    //TODO. orderBy절 bookmark 및 comment 추가 where 추가.
    async getReviewList(dto: GetReviewListDto){
        const reviewList = await this.reviewRepository.createQueryBuilder()
        .select(["review.title", "review.visit", "review.userID", "review.isbn", 
        "review.reg_date"])
        .limit(dto.limit)
        .offset(dto.offset)
        .orderBy(dto.orderBy)
        .where(dto.where)
        .getMany();
        return reviewList;
    }

    async postReview(dto: PostReviewDto){
        const userID = await this.userService.getUserByID(dto.userID, false, false);
        if(userID.communityID === 1){
            throw new BadRequestException("커뮤니티에 가입하지 않으면 글을 쓸 수 없습니다.");
        }
        const review = this.reviewRepository.create(dto);
        await this.reviewRepository.save(review);
    }

    async putReview(dto: PutReviewDto){
        await this.reviewRepository.update({
            ID: dto.reviewID,
            userID: dto.userID,
        },{
            title: dto.title,
            text: dto.text,
        });
    }

    async deleteReview(dto: DeleteReviewDto){
        const review = await this.reviewRepository.delete({
            ID: dto.reviewID,
            userID: dto.userID
        });
        if(review.affected !== 1){
            throw new BadRequestException("다른 사용자의 글을 삭제할 수 없습니다.");
        }
    }
}