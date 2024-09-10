import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";
import { hashPassword } from "../utils/password.util";

export enum UserRole {
  Volunteer = "Volunteer",
  Coordinator = "Coordinator",
  Admin = "Admin",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Column({ type: "varchar", nullable: true })
  email!: string | null;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.Volunteer,
  })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hashPassword(this.password);
  }
}
