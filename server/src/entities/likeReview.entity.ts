import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "./review.entity";
import { User } from "./user.entity";

@Entity()
export class LikeReview{
    @PrimaryGeneratedColumn()
    ID: number;
    @ManyToOne(() => Review)
    @JoinColumn()
    review: Review;
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
}