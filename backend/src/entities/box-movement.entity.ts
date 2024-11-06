import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Box } from "./box.entity";
import { User } from "./user.entity";
import { Location } from "./location.entity";


@Entity()
export class BoxMovement {
    @PrimaryGeneratedColumn()
    box_movement_id!: number;

    @OneToOne(() => Box)
    box!: Box;

    @OneToOne(() => User)
    moved_by!: User;

    @CreateDateColumn()
    moved_at!: Date;

    @OneToOne(() => Location)
    from_location!: Location;

    @OneToOne(() => Location)
    to_location!: Location;

    @Column()
    note?: string;

}