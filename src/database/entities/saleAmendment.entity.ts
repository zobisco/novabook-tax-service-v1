import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('SaleAmendment')
export class SaleAmendmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'text', length: 36 })
  invoiceId: string;

  @Column({ type: 'text', length: 36 })
  itemId: string;

  @Column({ type: 'integer' })
  cost: number;

  @Column({ type: 'float' })
  taxRate: number;

  @Column({ type: 'integer', nullable: true })
  taxPosition?: number;

  constructor(
    id: string,
    date: Date,
    invoiceId: string,
    itemId: string,
    cost: number,
    taxRate: number,
  ) {
    this.id = id;
    this.date = date;
    this.invoiceId = invoiceId;
    this.itemId = itemId;
    this.cost = cost;
    this.taxRate = taxRate;
  }
}
