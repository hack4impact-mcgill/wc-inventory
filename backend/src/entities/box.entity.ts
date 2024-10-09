import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Location } from "./location.entity";
import { BoxContent } from "./box-content.entity";
import { Tag } from "./tag.entity";


@Entity()
export class Box {

    @PrimaryGeneratedColumn()
    box_id!: number;

    @OneToMany(() => BoxContent, boxContent => boxContent.box)
    box_contents?: BoxContent;

    @Column()
    name!: string;

    @ManyToMany(() => Tag)
    @JoinTable()
    tags?: Tag[];

    @Column()
    description?: string

    @OneToOne(() => Location)
    locationId?: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

}