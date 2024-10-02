import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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