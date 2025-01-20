import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

  async getTransactionById(id: string): Promise<TransactionEntity> {
    try {
      const transaction = await this.transactionRepo.findOne({ where: { id } });

      if (!transaction) {
        throw new HttpException(`Transaction with ID ${id} not found`, HttpStatus.NOT_FOUND);
      }

      return transaction;
    } catch (error) {
      throw new HttpException(
        `Error fetching transaction: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  
  async getAllTransactions(): Promise<TransactionEntity[]> {
    try {
      const transactions = await this.transactionRepo.find();
      
      if (!transactions || transactions.length === 0) {
        throw new HttpException('No transactions found', HttpStatus.NOT_FOUND);
      }

      return transactions;
    } catch (error) {
      throw new HttpException(
        `Error fetching transactions: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createTransaction(transaction: TransactionDto): Promise<TransactionEntity> {
    const entity = this.transactionRepo.create({
      ...transaction,
      eventType: transaction.eventType as TransactionEventType,
    });

    return this.transactionRepo.save(entity);
  }
}
