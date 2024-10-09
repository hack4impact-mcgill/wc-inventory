import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    category_id!: number;

    @Column()
    name!: string;

<<<<<<< HEAD
    @ManyToOne(() => Category, category => category.subcategories, { nullable: true })
=======
    @ManyToOne(() => Category, category => category.children)
>>>>>>> 3792101e8c45f172a63b67aeed1f4c39ae19be13
    parentCategory?: Category;

    @OneToMany(() => Category, category => category.parentCategory)
    children!: Category[];

    @Column()
    level!: number;

    @BeforeInsert()
    @BeforeUpdate()
    async calculateLevel() {
        if (this.parentCategory) {
            this.level = this.parentCategory.level + 1;
        } else {
            this.level = 0;
        }
    }

}