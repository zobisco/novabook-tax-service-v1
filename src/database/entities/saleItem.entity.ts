import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Entity('SaleItem')
export class SaleItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  transactionId?: string;

  @Column({ type: 'text', nullable: true })
  itemId?: string;

  @Column({ type: 'integer', nullable: true })
  cost?: number;

  @Column({ type: 'float', nullable: true })
  taxRate?: number;

  @ManyToOne(() => TransactionEntity, (transaction) => transaction.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'transactionId' })
  transaction?: TransactionEntity;

  constructor(
    id: string,
    transactionId?: string,
    itemId?: string,
    cost?: number,
    taxRate?: number,
    transaction?: TransactionEntity,
  ) {
    this.id = id;
    this.transactionId = transactionId;
    this.itemId = itemId;
    this.cost = cost;
    this.taxRate = taxRate;
    this.transaction = transaction;
  }
}
