import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class TaxDto {
  @ApiProperty({
    description: 'Date of the tax position in ISO 8601 format',
    example: '2024-02-22T17:29:39Z',
  })
  @IsDateString()
  date: string;

  @ApiProperty({
    description: 'Calculated tax position at the given date in pennies',
    example: 500,
  })
  @IsNumber()
  taxPosition: number;

  constructor(date: string, taxPosition: number) {
    this.date = date;
    this.taxPosition = taxPosition;
  }
}
