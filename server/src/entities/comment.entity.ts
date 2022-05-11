import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LikeComment } from "./likeComment.entity";
import { Review } from "./review.entity";
import { User } from "./user.entity";

@Entity()
export class Comment{
    @PrimaryGeneratedColumn()
    ID: number;
    @Column()
    regDate: Date;
    @Column()
    text: string;
    

    @ManyToOne(() => User)
    @JoinColumn({
        name: "userNumber"
    })
    user: User
    @Column()
    userNumber: number;

    @ManyToOne(() => Review)
    @JoinColumn({
        name: "reviewID"
    })
    review: Review;
    @Column()
    reviewID: number;

    @OneToMany(() => LikeComment, likeComment => likeComment.comment)
    likeComment: LikeComment;
    
}