import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Review } from "./review.entity";
import { User } from "./user.entity";

@Entity()
export class Comment{
    @PrimaryGeneratedColumn()
    ID: number;
    @Column()
    reg_date: Date;
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
    @ManyToOne(() => Review)
    @JoinColumn()
    review: Review;
    @Column()
    text: string;
    
}