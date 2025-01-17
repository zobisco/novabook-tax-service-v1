import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../database/entities/transaction.entity';
import { TransactionDto } from '../dtos/transaction.dto';
import { TransactionEventType } from '../enums/transactionEventType.enum';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
  ) { }
  
  async getAllTransactions(): Promise<TransactionEntity[]> {
    return this.transactionRepo.find();
  }

  async createTransaction(transaction: TransactionDto): Promise<TransactionEntity> {
    const entity = this.transactionRepo.create({
      ...transaction,
      eventType: transaction.eventType as TransactionEventType,
    });

    return this.transactionRepo.save(entity);
  }
}
