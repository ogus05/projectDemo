import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { LikeComment } from "./likeComment.entity";
import { Review } from "./review.entity";
import { User } from "./user.entity";

@Entity()
export class Comment{
    @PrimaryGeneratedColumn()
    ID: number;
    @CreateDateColumn({
        type: 'timestamp'
        
    })
    regDate: any;
    @Column({
        type: 'text',
    })
    text: string;

    @Column({
        type: 'tinyint',
    })
    isOpen: boolean;
    

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
    
    count?: number;
}