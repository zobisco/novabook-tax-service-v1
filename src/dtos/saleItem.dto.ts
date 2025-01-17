import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsNumber, IsOptional } from 'class-validator';

export class SaleItemDto {
  @ApiProperty({
    description: 'Date of the amendment in ISO 8601 format',
    example: '2024-02-22T17:29:39Z',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Invoice ID of the sale to amend',
    example: '3419027d-960f-4e8f-b8b7-f7b2b4791824',
  })
  @IsString()
  invoiceId: string;

  @ApiProperty({
    description: 'Item ID to amend',
    example: '02db47b6-fe68-4005-a827-24c6e962f3df',
  })
  @IsString()
  itemId: string;

  @ApiProperty({
    description: 'New cost of the item in pennies',
    example: 798,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  cost?: number;

  @ApiProperty({
    description: 'New tax rate for the item',
    example: 0.15,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  taxRate?: number;

  @ApiProperty({
    description: 'Transaction ID associated with the sale item',
    required: false,
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  constructor(
    date: string,
    invoiceId: string,
    itemId: string,
    cost?: number,
    taxRate?: number,
    transactionId?: string,
  ) {
    this.date = date;
    this.invoiceId = invoiceId;
    this.itemId = itemId;
    this.cost = cost;
    this.taxRate = taxRate;
    this.transactionId = transactionId;
  }
}
