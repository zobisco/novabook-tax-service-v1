import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsDateString, IsOptional, IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TransactionDto {
  @ApiProperty({
    description: 'Type of the transaction (SALES or TAX_PAYMENT)'
  })
  @IsEnum(['SALES', 'TAX_PAYMENT'])
  eventType: string;

  @ApiProperty({
    description: 'Date of the transaction in ISO 8601 format',
    example: '2024-02-22T17:29:39Z',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Invoice ID for SALES transactions (optional for TAX_PAYMENT)',
    example: '3419027d-960f-4e8f-b8b7-f7b2b4791824',
    required: false,
  })
  @IsOptional()
  @IsString()
  invoiceId?: string;

  @ApiProperty({
    description: 'Amount for TAX_PAYMENT transactions (optional for SALES)',
    example: 74901,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    description: 'Items for SALES transactions (optional for TAX_PAYMENT)',
    required: false,
    type: 'array',
    example: [
      {
        itemId: '02db47b6-fe68-4005-a827-24c6e962f3df',
        cost: 1099,
        taxRate: 0.2,
      },
    ],
  })
  @IsOptional()
  @IsArray()
  // @ValidateNested({ each: true })
  @Type(() => TransactionItemDto)
  items?: TransactionItemDto[];

  constructor(
    eventType: string,
    date: string,
    invoiceId?: string,
    amount?: number,
    items?: TransactionItemDto[],
  ) {
    this.eventType = eventType;
    this.date = date;
    this.invoiceId = invoiceId;
    this.amount = amount;
    this.items = items;
  }
}

export class TransactionItemDto {
  @ApiProperty({
    example: '02db47b6-fe68-4005-a827-24c6e962f3df'
  })
  @IsString()
  itemId: string;

  @ApiProperty({
    description: 'Cost of the item in pennies',
    example: 1099
  })
  @IsNumber()
  cost: number;

  @ApiProperty({
    description: 'Tax rate applied to the item',
    example: 0.2
  })
  @IsNumber()
  taxRate!: number;

  constructor(itemId: string, cost: number, taxRate: number) {
    this.itemId = itemId;
    this.cost = cost;
    this.taxRate = taxRate;
  }
}
