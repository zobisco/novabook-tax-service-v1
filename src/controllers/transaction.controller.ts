import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { TransactionService } from '../services/transaction.service';
import { TransactionDto } from '../dtos/transaction.dto';
import { TransactionEntity } from '../database/entities/transaction.entity';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all transactions' })
  @ApiResponse({
    status: 200,
    description: 'All transactions',
    type: TransactionEntity,
    isArray: true,
  })
  async getAllTransactions(): Promise<TransactionEntity[]> {
    try {
      return await this.transactionService.getAllTransactions();
    } catch (error) {
      throw new HttpException(
        `Error fetching transactions: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new transaction (SALES or TAX_PAYMENT)' })
  @ApiResponse({
    status: 202,
    description: 'The transaction has been successfully created.',
    type: TransactionEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid transaction data.',
  })
  @ApiBody({
    description: 'Request body for creating a transaction (SALES or TAX_PAYMENT)',
    schema: {
      oneOf: [
        {
          example: {
            eventType: 'SALES',
            date: '2024-02-22T17:29:39Z',
            invoiceId: '3419027d-960f-4e8f-b8b7-f7b2b4791824',
            items: [
              {
                itemId: '02db47b6-fe68-4005-a827-24c6e962f3df',
                cost: 1099,
                taxRate: 0.2,
              },
            ],
          },
        },
        {
          example: {
            eventType: 'TAX_PAYMENT',
            date: '2024-02-22T17:29:39Z',
            amount: 74901,
          },
        },
      ],
    },
  })
  async createTransaction(@Body() transaction: TransactionDto): Promise<TransactionEntity> {
    try {
      return await this.transactionService.createTransaction(transaction);
    } catch (error) {
      throw new HttpException(
        `Error creating transaction: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
