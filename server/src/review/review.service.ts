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
        try{
            const res = await this.reviewRepository.createQueryBuilder()
            .where(`ID = :reviewID`, {reviewID})
            .getOne();
            if(!res) throw new Error();
            else return res;
        } catch(e){
            throw e;
        }
    }

    async getReviewList(dto: GetReviewListDto){
        try{
            const res = await this.reviewRepository.createQueryBuilder()
            .limit(dto.limit)
            .offset(dto.offset)
            .getMany();
            if(res.length > 0) return res;
            else throw new Error();
        } catch(e){
            console.log(e);
            throw e;
        }
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