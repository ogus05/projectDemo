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

    async getReviewInfo(reviewID: number){
        const review = await this.reviewRepository.createQueryBuilder('review')
        .select(["review.ID", "review.title", "review.text", "review.regDate", "user.nickname", "user.number"])
        .leftJoin("review.user", "user")
        .where("review.ID = :keyReviewID", {keyReviewID: reviewID})
        .getOne();
        const count = await this.reviewRepository.count();
        return {review, count};
    }


    async getReviewList(dto: GetReviewListDto){
        let qb = this.reviewRepository.createQueryBuilder('review')
        .select(['review.ISBN', 'review.title', 'user.nickname', 'community.name', 'review.regDate',
        'review.ID'])
        .leftJoin('review.user', 'user')
        .leftJoin('review.community', 'community')
        .offset(dto.offset)
        .limit(dto.limit);
        if(!dto.where || !dto.query){
            return await qb.getManyAndCount();
        } else if(dto.where ==="community"){
            return await qb.where('community.ID = :keyCommunityID', {keyCommunityID: dto.query}).getManyAndCount()
        } else if(dto.where ==="user"){
            return await qb.where('user.number = :keyUserNumber', {keyUserNumber: dto.query}).getManyAndCount();
        }
    }

    async createReview(dto: PostReviewDto){
        const user = await this.userService.getUserInfo(dto.userNumber);
        if(user.communityID === 1){
            throw new BadRequestException("커뮤니티에 가입하지 않으면 글을 쓸 수 없습니다.");
        }
        const review = this.reviewRepository.create(dto);
        await this.reviewRepository.save(review);
    }

    async putReview(dto: PutReviewDto){
        await this.reviewRepository.update({
            ID: dto.reviewID,
            userNumber: dto.userNumber,
        },{
            title: dto.title,
            text: dto.text,
        });
    }

    async deleteReview(dto: DeleteReviewDto){
        const review = await this.reviewRepository.delete({
            ID: dto.reviewID,
            userNumber: dto.userNumber,
        });
        if(review.affected !== 1){
            throw new BadRequestException("다른 사용자의 글을 삭제할 수 없습니다.");
        }
    }
}