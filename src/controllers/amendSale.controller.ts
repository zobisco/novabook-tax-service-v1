import { Controller, Patch, Body, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBody, ApiOperation } from '@nestjs/swagger';
import { SaleAmendmentService } from '../services/saleAmendment.service';
import { SaleItemDto } from '../dtos/saleItem.dto';

@ApiTags('sale')
@Controller('sale')
export class AmendSaleController {
  constructor(private readonly saleAmendmentService: SaleAmendmentService) {}

  @Patch()
  @ApiOperation({ summary: 'Amend a sales item' })
  @ApiResponse({
    status: 202,
    description: 'The amendment has been successfully processed.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid amendment request.',
  })
  @ApiBody({
    description: 'Request body for amending a sales item',
    schema: {
      type: 'object',
      properties: {
        date: { type: 'string', example: '2024-02-22T17:29:39Z' },
        invoiceId: { type: 'string', example: '3419027d-960f-4e8f-b8b7-f7b2b4791824' },
        itemId: { type: 'string', example: '02db47b6-fe68-4005-a827-24c6e962f3df' },
        cost: { type: 'number', example: 798 },
        taxRate: { type: 'number', example: 0.15 },
      },
    },
  })
  @HttpCode(202)
  async amendSale(@Body() amendment: SaleItemDto): Promise<void> {
    try {
      await this.saleAmendmentService.createAmendment(amendment);
    } catch (error) {
      throw new HttpException(
        `Error processing amendment: ${error}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
