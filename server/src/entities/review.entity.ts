import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { User } from "./user.entity";

@Entity()
export class Review{
    @PrimaryGeneratedColumn()
    ID: number;
    @Column()
    title: string;
    @Column()
    text: string;
    @Column({
        default: 0,
    })
    visit: number;
    @ManyToOne(() => User)
    @JoinColumn({
        name: "userID"
    })
    user: User;
    @OneToMany(() => Comment, comment => comment.review)
    comment: Comment[];
    
    @Column({
        name: "book_title",
    })
    bookTitle: string;
    @Column({
        name: "book_cover",
    })
    bookCover: string;
    @Column({
        name: "book_author"
    })
    bookAuthor: string;
}