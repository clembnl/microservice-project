import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity()
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;  // Non-null assertion operator

  @Column()
  userId!: string;

  @Column("simple-array")
  productIds!: string[];

  @Column('decimal')
  total!: number;

  @Column()
  status!: string;
}