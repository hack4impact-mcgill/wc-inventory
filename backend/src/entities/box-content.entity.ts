import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Box } from "./box.entity";
import { Category } from "./category.entity";

export enum ContentSize {
    "XXS" = "XXS",
    "XS" = "XS",
    "S" = "S",
    "M" = "M",
    "L" = "L",
    "XL" = "XL",
    "XXL" = "XXL",
    "XXXL" = "XXXL",
}

export enum Gender {
    "M" = "M",
    "F" = "F",
    "U" = "U",
}

@Entity()
export class BoxContent {

    @PrimaryGeneratedColumn()
    box_content_id!: number;

    @ManyToOne(() => Box)
    box!: Box;

    @Column({
        type: "enum",
        enum: ContentSize
    })
    size!: ContentSize;

    @OneToOne(() => Category)
    categories?: Category;


    @Column({
        type: "enum",
        enum: Gender
    })
    gender!: Gender;

    @Column({ type: "int", default: 1 })
    quantity!: number;


}