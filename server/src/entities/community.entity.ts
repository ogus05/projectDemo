import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Community{
    @PrimaryGeneratedColumn()
    ID: number;

    @Column({
        unique: true,
        nullable: false,
    })
    name: string;
    @OneToOne(() => User)
    @JoinColumn({
        name: "leaderNumber"
    })
    leader: User;
    @Column({
    })
    leaderNumber: number;
    @Column({
        type: "tinyint",
        nullable: false,
        default: false,
    })
    isOpen: number;
    @Column({
        type: "text",
        nullable: false,
    })
    message: string;
    @CreateDateColumn({
        type:"datetime",
    })
    regDate: Date;

    @OneToMany(() => User, user => user.community)
    user: User[];
}