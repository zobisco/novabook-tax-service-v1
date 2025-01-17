import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TaxPositionService } from '../services/tax.service';
import { TaxDto } from '../dtos/tax.dto';

@ApiTags('tax-position')
@Controller('tax-position')
export class TaxController {
  constructor(private readonly taxService: TaxPositionService) {}

  @Get()
  @ApiOperation({ summary: 'Get the tax position for a specific date' })
  @ApiQuery({
    name: 'date',
    description: 'Date and time in ISO 8601 format (e.g., 2024-02-22T17:29:39Z)',
    required: true,
    example: '2024-02-22T18:31:00Z',
  })
  @ApiResponse({
    status: 200,
    description: 'Tax position for the given date.',
    type: TaxDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or missing date parameter.' })
  async getTaxPosition(@Query('date') date: string): Promise<TaxDto> {
    if (!date) {
      throw new HttpException(
        'Invalid request. "date" query parameter is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (isNaN(Date.parse(date))) {
      throw new HttpException(
        'Invalid date format. Use ISO 8601 format (e.g., 2024-02-22T17:29:39Z).',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.taxService.getTaxPosition(date);

    return new TaxDto(result.date, result.taxPosition);
  }
}
