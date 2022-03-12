import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "src/entities/review.entity";
import { Repository } from "typeorm";
import { GetReviewListDto, PostReviewDto } from "./dto/review.dto";

@Injectable()
export class ReviewService{
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>
    ){}

    async getReviewByID(reviewID: number){
        const review = await this.reviewRepository.createQueryBuilder('review')
        .select(["review.title", "review.text", "review.visit", "review.userID", "review.book_title",
        "review.book_cover", "review.book_author"])
        .where("ID = :keyReviewID", {keyReviewID: reviewID})
        .getOne();
        return review;
    }

    async getReviewList(dto: GetReviewListDto){
        const reviewList = await this.reviewRepository.createQueryBuilder()
        .select(["review.title", "review.visit", "review.userID", "review.book_title", "review.book_cover"])
        .limit(dto.limit as number)
        .offset(dto.offset as number)
        .orderBy(dto.orderBy)
        .getMany();
        return reviewList;
    }

    async postReview(dto: PostReviewDto){
        try{
            const review = this.reviewRepository.create({
                title: dto.title, text: dto.text, user: null,
                bookAuthor: dto.bookAuthor, bookCover: dto.bookCover, bookTitle: dto.bookTitle
            });
            await this.reviewRepository.save(review);
            return true;
        } catch(e){
            console.log(e);
            return false;
        }
    }
}