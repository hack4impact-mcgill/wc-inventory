import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert, ManyToOne, JoinColumn,
} from "typeorm";
import { hashPassword } from "../utils/password.util";

export enum UserRole {
  Volunteer = "Volunteer",
  Coordinator = "Coordinator",
  Admin = "Admin",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

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

  // Optional field to track the admin who created this user
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "createdBy" })
  createdBy!: User | null;  // This references the User who is the admin

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hashPassword(this.password);
  }
}
