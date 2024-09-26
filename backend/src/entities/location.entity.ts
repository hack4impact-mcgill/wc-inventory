import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";

@Entity()
export class Location {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => Location, (location) => location.subcategories)
  parentCategory?: Location;

  @OneToMany(() => Location, (location) => location.parentCategory)
  subcategories!: Location[];
}
