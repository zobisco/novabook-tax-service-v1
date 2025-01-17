import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaxPositionService } from '../tax.service';
import { TransactionEntity } from '../../database/entities/transaction.entity';
import { BadRequestException } from '@nestjs/common';
import { SaleItemEntity } from '../../database/entities/saleItem.entity';

describe('TaxPositionService', () => {
  let service: TaxPositionService;
  let transactionRepo: Repository<TransactionEntity>;

  const mockTransactionRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxPositionService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: mockTransactionRepo,
        },
      ],
    }).compile();

    service = module.get<TaxPositionService>(TaxPositionService);
    transactionRepo = module.get<Repository<TransactionEntity>>(
      getRepositoryToken(TransactionEntity),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return tax position correctly when there are no transactions ✅', async () => {
      mockTransactionRepo.find.mockResolvedValue([]);

      const result = await service.getTaxPosition('2024-02-22T17:29:39Z');

      expect(mockTransactionRepo.find).toHaveBeenCalled();
      expect(result).toEqual({
        date: '2024-02-22T17:29:39.000Z',
        taxPosition: 0,
      });
    });

  it('should calculate tax position correctly for sales and tax payments ✅', async () => {
      const mockTransactions: TransactionEntity[] = [
        {
          id: '1',
          eventType: 'SALES',
          date: new Date('2024-02-22T17:00:00Z'),
          invoiceId: 'invoice0',
          items: [
            { itemId: 'item1', cost: 100, taxRate: 0.2 } as SaleItemEntity,
            { itemId: 'item2', cost: 200, taxRate: 0.1 } as SaleItemEntity,
          ],
        },
        {
          id: '2',
          eventType: 'TAX_PAYMENT',
          date: new Date('2024-02-22T17:10:00Z'),
          invoiceId: 'invoice1',
          amount: 50,
          items: [],
        },
      ];

      mockTransactionRepo.find.mockResolvedValue(mockTransactions);

      const result = await service.getTaxPosition('2024-02-22T17:29:39Z');

      expect(mockTransactionRepo.find).toHaveBeenCalled();
      expect(result).toEqual({
        date: '2024-02-22T17:29:39.000Z',
        taxPosition: -10, // (100*0.2) + (200*0.1) - 50 = -10
      });
    });

  it('should only consider transactions before or on the query date ✅', async () => {
      const mockTransactions: TransactionEntity[] = [
        {
          id: '1',
          eventType: 'SALES',
          date: new Date('2024-02-22T17:00:00Z'),
          invoiceId: 'invoice1',
          amount: 0,
          items: [{ itemId: 'item1', cost: 500, taxRate: 0.1 } as SaleItemEntity],
        },
        {
          id: '2',
          eventType: 'TAX_PAYMENT',
          date: new Date('2024-02-22T17:10:00Z'),
          invoiceId: undefined,
          amount: 40,
          items: [],
        },
        {
          id: '3',
          eventType: 'SALES',
          date: new Date('2024-02-23T18:00:00Z'), // Future date
          invoiceId: 'invoice2',
          amount: 0,
          items: [{ itemId: 'item2', cost: 1000, taxRate: 0.2 } as SaleItemEntity],
        },
      ];

      mockTransactionRepo.find.mockResolvedValue(mockTransactions);

      const result = await service.getTaxPosition('2024-02-22T17:29:39Z');

      expect(mockTransactionRepo.find).toHaveBeenCalled();
      expect(result).toEqual({
        date: '2024-02-22T17:29:39.000Z',
        taxPosition: 10, // (500*0.1) - 40 = 10
      });
    });

  it('should throw an error if date parameter is invalid ❌', async () => {
    await expect(service.getTaxPosition('invalid-date')).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.getTaxPosition('invalid-date')).rejects.toThrow(
      'Invalid date format. Use ISO 8601 format.',
    );
  });

    it('should throw BadRequestException if date parameter is missing ❌', async () => {
    await expect(service.getTaxPosition('')).rejects.toThrow(
      BadRequestException,
    );
    await expect(service.getTaxPosition('')).rejects.toThrow(
      'Missing "date" query parameter',
    );
  });
});
