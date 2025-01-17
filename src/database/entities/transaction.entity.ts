import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SaleItemEntity } from './saleItem.entity';

@Entity('Transaction')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  eventType: string;

  @Column({ type: 'text' })
  date: Date;

  @Column({ type: 'text', nullable: true })
  invoiceId?: string;

  @Column({ type: 'integer', nullable: true })
  amount?: number;

  @OneToMany(() => SaleItemEntity, (saleItem) => saleItem.transaction, {
    cascade: true,
  })
  items?: SaleItemEntity[];

  constructor(
    id: string,
    eventType: string,
    date: Date,
    invoiceId?: string,
    amount?: number,
    items?: SaleItemEntity[],
  ) {
    this.id = id;
    this.eventType = eventType;
    this.date = date;
    this.invoiceId = invoiceId;
    this.amount = amount;
    this.items = items;
  }
}
