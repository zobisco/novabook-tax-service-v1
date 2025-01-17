import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SaleItemEntity } from '../database/entities/saleItem.entity';
import { SaleItemDto } from '../dtos/saleItem.dto';

@Injectable()
export class SaleAmendmentService {
  constructor(
    @InjectRepository(SaleItemEntity)
    private readonly saleAmendmentRepo: Repository<SaleItemEntity>,
  ) {}

  async createAmendment(saleAmendment: SaleItemDto): Promise<SaleItemEntity> {
    let existingItem = await this.saleAmendmentRepo.findOne({
      where: {
        transactionId: saleAmendment.transactionId,
        itemId: saleAmendment.itemId,
      },
    });

    if (existingItem) {
      existingItem.cost = saleAmendment.cost ?? existingItem.cost;
      existingItem.taxRate = saleAmendment.taxRate ?? existingItem.taxRate;
    } else {
      existingItem = this.saleAmendmentRepo.create(saleAmendment);
    }

    return this.saleAmendmentRepo.save(existingItem);
  }
}
