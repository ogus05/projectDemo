import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class ConfirmMail{
    @PrimaryGeneratedColumn()
    ID: number;

    @ManyToOne(() => User, {
        onDelete: "CASCADE",
        eager: true
    })
    @JoinColumn({
        name: "userNumber"
    })
    user: User;

    @Column()
    userNumber: number;

    @Column()
    type: number;

    @Column()
    token: string;
}