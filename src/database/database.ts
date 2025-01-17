import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SaleItemEntity } from './entities/saleItem.entity';
import { SaleAmendmentEntity } from './entities/saleAmendment.entity';
import { TransactionEntity } from './entities/transaction.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'novabook.sqlite',
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  migrations: ['./dist/database/migrations/*.js'],
};
