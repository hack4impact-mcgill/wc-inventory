import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Box } from "./box.entity";


@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    tag_id!: number;
    
    
    @Column({unique: true})
    name!: string;

    @OneToMany(() => Box, box => box.tags)
    boxes?: Box[];

    @Column()
    description?: string;
}