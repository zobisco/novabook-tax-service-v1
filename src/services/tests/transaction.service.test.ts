import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TransactionService } from '../transaction.service';
import { TransactionEntity } from '../../database/entities/transaction.entity';
import { TransactionDto } from '../../dtos/transaction.dto';
import { TransactionEventType } from '../../enums/transactionEventType.enum';

describe('TransactionService', () => {
  let service: TransactionService;
  let transactionRepo: Repository<TransactionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepo = module.get<Repository<TransactionEntity>>(getRepositoryToken(TransactionEntity));
  });

  describe('createTransaction', () => {
    it('should create and save a transaction', async () => {
      const transactionDto: TransactionDto = {
        eventType: TransactionEventType.SALES,
        date: new Date('2024-02-22T17:29:39Z').toISOString(),
        invoiceId: '3419027d-960f-4e8f-b8b7-f7b2b4791824',
        items: [
          {
            itemId: 'item1',
            cost: 1099,
            taxRate: 0.2,
          },
        ],
        amount: 1000,
      };

      const savedEntity: TransactionEntity = {
        ...transactionDto,
        date: new Date(transactionDto.date),
        items: transactionDto.items?.map((item) => ({
          ...item,
        })),
      } as TransactionEntity;

      jest.spyOn(transactionRepo, 'create').mockReturnValue(savedEntity);
      jest.spyOn(transactionRepo, 'save').mockResolvedValue(savedEntity);

      const result = await service.createTransaction(transactionDto);

      expect(transactionRepo.create).toHaveBeenCalledWith({
        ...transactionDto,
        date: new Date(transactionDto.date).toISOString(),
        items: transactionDto.items?.map((item) => ({
          ...item,
        })),
      });

      expect(transactionRepo.save).toHaveBeenCalledWith(savedEntity);
      expect(result).toEqual(savedEntity);
    });
  });
});
