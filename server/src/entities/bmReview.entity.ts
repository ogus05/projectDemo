import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "./review.entity";
import { User } from "./user.entity";

@Entity()
export class BmReview{
    @PrimaryGeneratedColumn()
    ID: number;
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
    @OneToOne(() => Review)
    @JoinColumn()
    bm_review: Review;
}