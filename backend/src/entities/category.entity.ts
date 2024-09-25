import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => Category, category => category.subcategories)
    parentCategory?: Category;

    @OneToMany(() => Category, category => category.parentCategory)
    subcategories!: Category[];

}