import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../database/entities/transaction.entity';

@Injectable()
export class TaxPositionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
  ) {}

  async getTaxPosition(date: string): Promise<{ date: string; taxPosition: number }> {
    if (!date) {
      throw new BadRequestException('Missing "date" query parameter');
    }

    const queryDate = new Date(date);

    if (isNaN(queryDate.getTime())) {
      throw new BadRequestException('Invalid date format. Use ISO 8601 format.');
    }

    const transactions = await this.transactionRepo.find({
			relations: ['items'],
		});

    let sumSalesTax = 0;
    let sumTaxPayments = 0;

    for (const event of transactions) {
      const eventDate = new Date(event.date);

      if (eventDate <= queryDate) {

        if (event.eventType === 'SALES' && event.items) {
          for (const item of event.items) {
            const tax = (item.cost ?? 0) * (item.taxRate ?? 0);
            sumSalesTax += tax;
          }
        }

        if (event.eventType === 'TAX_PAYMENT') {
          sumTaxPayments += event.amount || 0;
        }
      }
    }

    const taxPosition = sumSalesTax - sumTaxPayments;

    return {
      date: queryDate.toISOString(),
      taxPosition,
    };
  }
}
