import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class Location {
    @PrimaryGeneratedColumn() // Changed from "uuid" to int
    location_id!: number; // Changed to int

    @Column({ length: 100 })
    name!: string;

    @Column({ type: "text", nullable: true }) // Optional description
    description?: string;

    @ManyToOne(() => Location, location => location.children)
    parentLocation?: Location;

    @OneToMany(() => Location, location => location.parentLocation)
    children!: Location[];

    @Column({ type: "int", default: 0 })
    level!: number;

    @BeforeInsert()
    @BeforeUpdate()
    async calculateLevel() {
        if (this.parentLocation) {
            this.level = this.parentLocation.level + 1;
        } else {
            this.level = 0;
        }
    }
}