import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class BmUser{
    @PrimaryGeneratedColumn()
    ID: number;
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
    @ManyToOne(() => User)
    @JoinColumn()
    bm_user: User;
}