import { DataSource } from 'typeorm';
import { TransactionEntity } from './database/entities/transaction.entity';
import { SaleItemEntity } from './database/entities/saleItem.entity';
import { SaleAmendmentEntity } from './database/entities/saleAmendment.entity';

const dataSource = new DataSource({
  type: 'sqlite',
  database: 'novabook.sqlite',
  entities: [SaleItemEntity, SaleAmendmentEntity, TransactionEntity],
  migrations: ['./dist/src/database/migrations/*.js'],
});

export default dataSource;
