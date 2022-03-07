import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Profile{
    @PrimaryGeneratedColumn()
    ID: number;
    @OneToOne(() => User, user=> user.profile)
    user: User;
    
    @Column()
    phone: string;
    @Column()
    email: string;
    @Column({
        nullable: true,
        type: "mediumblob",
    })
    photo: string;
    @Column({
        nullable: true,
        type: "text",
    })
    message: string;
    @Column({
        default: false,
        type: "tinyint"
    })
    acceptMail: boolean;
}