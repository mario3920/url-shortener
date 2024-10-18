import { ApiPropertyOptional } from "@nestjs/swagger";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, IsNull, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Url {
  @ApiPropertyOptional({ description: 'Auto generated ID'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiPropertyOptional({ description: 'Original link'})
  @Column()
  defaultUrl: string;

  @ApiPropertyOptional({ description: 'Shorten link'})
  @Column()
  shortenedUrl: string;

  @ApiPropertyOptional({ description: 'many times link was clicked'})
  @Column({default:0})
  clickCounter: number;

  @ManyToOne(() => User, (user) => user.urls)
  @Column({name:"urlOwnerId", nullable:true})
  urlOwner:string

  @UpdateDateColumn()
  updatedAt: Date

  @CreateDateColumn()
  createdAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
