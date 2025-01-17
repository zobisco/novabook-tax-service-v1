import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { SaleItemEntity } from '../../database/entities/saleItem.entity';
import { SaleAmendmentService } from './../saleAmendment.service';
import { SaleItemDto } from '../../dtos/saleItem.dto';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('SaleAmendmentService', () => {
  let service: SaleAmendmentService;
  let repository: Repository<SaleItemEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SaleAmendmentService,
        {
          provide: getRepositoryToken(SaleItemEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SaleAmendmentService>(SaleAmendmentService);
    repository = module.get<Repository<SaleItemEntity>>(getRepositoryToken(SaleItemEntity));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAmendment', () => {
    it('should update an existing SaleItem if it exists', async () => {
      const existingItem: SaleItemEntity = {
        id: '1',
        transactionId: 'transaction1',
        itemId: 'item1',
        cost: 100,
        taxRate: 0.1,
        transaction: undefined,
      };

      const saleAmendmentDto: SaleItemDto = {
        transactionId: 'transaction1',
        itemId: 'item1',
        cost: 200,
        taxRate: 0.15,
        date: '2024-02-22T17:29:39Z',
        invoiceId: 'invoice1',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(existingItem);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...existingItem, ...saleAmendmentDto });

      const result = await service.createAmendment(saleAmendmentDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { transactionId: saleAmendmentDto.transactionId, itemId: saleAmendmentDto.itemId },
      });
      expect(repository.save).toHaveBeenCalledWith({
        ...existingItem,
        cost: saleAmendmentDto.cost,
        taxRate: saleAmendmentDto.taxRate,
      });
      expect(result).toEqual({ ...existingItem, ...saleAmendmentDto });
    });

    it('should create a new SaleItem if it does not exist', async () => {
      const saleAmendmentDto: SaleItemDto = {
        transactionId: 'transaction1',
        itemId: 'item1',
        cost: 200,
        taxRate: 0.15,
        date: '2024-02-22T17:29:39Z',
        invoiceId: 'invoice1',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockReturnValue({
        id: 'mockId',
        transaction: undefined,
        ...saleAmendmentDto,
      } as SaleItemEntity);
      jest.spyOn(repository, 'save').mockResolvedValue({
        id: 'mockId',
        transaction: undefined,
        ...saleAmendmentDto,
      } as SaleItemEntity);

      const result = await service.createAmendment(saleAmendmentDto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { transactionId: saleAmendmentDto.transactionId, itemId: saleAmendmentDto.itemId },
      });
      expect(repository.create).toHaveBeenCalledWith(saleAmendmentDto);
      expect(repository.save).toHaveBeenCalledWith({
        id: 'mockId',
        transaction: undefined,
        ...saleAmendmentDto,
      });
      expect(result).toEqual({
        id: 'mockId',
        transaction: undefined,
        ...saleAmendmentDto,
      });
    });
  });
});
