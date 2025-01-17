import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './database/database';
import { AmendSaleController } from './controllers/amendSale.controller';
import { TaxController } from './controllers/tax.controller';
import { TransactionController } from './controllers/transaction.controller';
import { SaleAmendmentService } from './services/saleAmendment.service';
import { TaxPositionService } from './services/tax.service';
import { TransactionService } from './services/transaction.service';
import { SaleItemEntity } from './database/entities/saleItem.entity';
import { SaleAmendmentEntity } from './database/entities/saleAmendment.entity';
import { TransactionEntity } from './database/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([SaleAmendmentEntity, SaleItemEntity, TransactionEntity]),
  ],
  controllers: [AmendSaleController, TaxController, TransactionController],
  providers: [SaleAmendmentService, TaxPositionService, TransactionService],
})
export class AppModule {}
