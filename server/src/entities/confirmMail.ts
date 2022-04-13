import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "./comment.entity";
import { User } from "./user.entity";

@Entity()
export class ConfirmMail{
    @PrimaryGeneratedColumn()
    ID: number;

    @ManyToOne(() => User, {
        onDelete: "CASCADE"
    })
    @JoinColumn({
        name: "userID",
    })
    user: User;

    @Column()
    userID: string;

    @Column()
    type: number;

    @Column()
    token: string;
}