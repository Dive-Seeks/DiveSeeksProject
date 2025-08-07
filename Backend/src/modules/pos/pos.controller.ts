import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PosService } from './pos.service';
import { CreatePoDto } from './dto/create-po.dto';
import { UpdatePoDto } from './dto/update-po.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../shared/enums';

@ApiTags('Point of Sale (POS)')
@Controller('pos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.BUSINESS_OWNER,
    UserRole.BRANCH_MANAGER,
    UserRole.CASHIER,
  )
  @ApiOperation({ summary: 'Create a new POS transaction' })
  @ApiBody({ type: CreatePoDto })
  @ApiResponse({
    status: 201,
    description: 'POS transaction created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 409, description: 'POS transaction already exists' })
  create(@Body() createPoDto: CreatePoDto) {
    return this.posService.create(createPoDto);
  }

  @Get()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.BUSINESS_OWNER,
    UserRole.BRANCH_MANAGER,
    UserRole.CASHIER,
  )
  @ApiOperation({ summary: 'Get all POS transactions' })
  @ApiResponse({
    status: 200,
    description: 'POS transactions retrieved successfully',
  })
  findAll() {
    return this.posService.findAll();
  }

  @Get(':id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.BUSINESS_OWNER,
    UserRole.BRANCH_MANAGER,
    UserRole.CASHIER,
  )
  @ApiOperation({ summary: 'Get POS transaction by ID' })
  @ApiParam({ name: 'id', description: 'POS transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'POS transaction retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'POS transaction not found' })
  findOne(@Param('id') id: string) {
    return this.posService.findOne(+id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.BUSINESS_OWNER, UserRole.BRANCH_MANAGER)
  @ApiOperation({ summary: 'Update POS transaction by ID' })
  @ApiParam({ name: 'id', description: 'POS transaction ID' })
  @ApiBody({ type: UpdatePoDto })
  @ApiResponse({
    status: 200,
    description: 'POS transaction updated successfully',
  })
  @ApiResponse({ status: 404, description: 'POS transaction not found' })
  update(@Param('id') id: string, @Body() updatePoDto: UpdatePoDto) {
    return this.posService.update(+id, updatePoDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.BUSINESS_OWNER, UserRole.BRANCH_MANAGER)
  @ApiOperation({ summary: 'Delete POS transaction by ID' })
  @ApiParam({ name: 'id', description: 'POS transaction ID' })
  @ApiResponse({
    status: 200,
    description: 'POS transaction deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'POS transaction not found' })
  remove(@Param('id') id: string) {
    return this.posService.remove(+id);
  }
}
