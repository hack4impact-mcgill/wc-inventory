import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Location {
  @PrimaryGeneratedColumn("uuid") // Change to UUID
  location_id!: string; // Updated to match UUID type

  @Column({ length: 100 })
  name!: string;
  
  @Column({ type: "text", nullable: true }) // Optional description
  description?: string;

  @ManyToOne(() => Location, location => location.subcategories)
  parentCategory?: Location;

  @OneToMany(() => Location, location => location.parentCategory)
  subcategories!: Location[];

  @Column({ type: "int", default: 0 })
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
