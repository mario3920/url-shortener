import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  defaultUrl: string;

  @Column()
  shortenedUrl: string;

  @Column({default:0})
  clickCounter: number;

  @ManyToOne(() => User, (user) => user.urls)
  @Column({name:"urlOwnerId"})
  urlOwner:string

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
