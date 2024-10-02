import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => Location, location => location.subcategories)
    parentCategory?: Location;

    @OneToMany(() => Location, location => location.parentCategory)
    subcategories!: Location[];

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