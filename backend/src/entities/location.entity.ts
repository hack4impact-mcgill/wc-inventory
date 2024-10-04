import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class Location {
  @PrimaryGeneratedColumn("uuid") // Change to UUID
  location_id!: string; // Updated to match UUID type

  @Column({ length: 100 })
  name!: string;

  @Column({ type: "text", nullable: true }) // Optional description
  description?: string;

  @Column({ type: "int", default: 0 }) // Can be 0, 1, or 2
  level: number;

  @ManyToOne(() => Location, (location) => location.subcategories, { nullable: true })
  parentCategory?: Location;

  @OneToMany(() => Location, (location) => location.parentCategory)
  subcategories!: Location[];
}
