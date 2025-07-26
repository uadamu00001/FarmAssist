import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SuppliersService, SupplierWithDistance } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SearchSuppliersDto } from './dto/search-suppliers.dto';
import { Supplier } from './entities/supplier.entity';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles/role.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('suppliers')
export class SuppliersController {
  private readonly logger = new Logger(SuppliersController.name);

  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
  ): Promise<Supplier> {
    this.logger.log(`Creating supplier: ${createSupplierDto.name}`);
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  async findAll(): Promise<Supplier[]> {
    this.logger.log('Fetching all suppliers');
    return this.suppliersService.findAll();
  }

  @Get('search/nearby')
  async findNearbySuppliers(
    @Query() searchDto: SearchSuppliersDto,
  ): Promise<SupplierWithDistance[]> {
    this.logger.log(`Searching nearby suppliers for: ${searchDto.product}`);
    return this.suppliersService.findNearbySuppliers(searchDto);
  }

  @Get('product/:product')
  async findSuppliersByProduct(
    @Param('product') product: string,
  ): Promise<Supplier[]> {
    this.logger.log(`Finding suppliers for product: ${product}`);
    return this.suppliersService.findSuppliersByProduct(product);
  }

  @Get('search/location')
  async getSuppliersByLocation(
    @Query('city') city: string,
    @Query('state') state?: string,
  ): Promise<Supplier[]> {
    this.logger.log(`Finding suppliers in ${city}${state ? `, ${state}` : ''}`);
    return this.suppliersService.getSuppliersByLocation(city, state);
  }

  @Get('top-rated')
  async getTopRatedSuppliers(
    @Query('limit') limit?: number,
  ): Promise<Supplier[]> {
    const supplierLimit = limit ? parseInt(limit.toString(), 10) : 10;
    this.logger.log(`Fetching top ${supplierLimit} rated suppliers`);
    return this.suppliersService.getTopRatedSuppliers(supplierLimit);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Supplier> {
    this.logger.log(`Fetching supplier with ID: ${id}`);
    return this.suppliersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    this.logger.log(`Updating supplier with ID: ${id}`);
    return this.suppliersService.update(id, updateSupplierDto);
  }

  @Patch(':id/rating')
  @UseGuards(JwtAuthGuard)
  async updateRating(
    @Param('id') id: string,
    @Body() ratingData: { rating: number; reviewCount: number },
  ): Promise<Supplier> {
    this.logger.log(`Updating rating for supplier ID: ${id}`);
    return this.suppliersService.updateSupplierRating(
      id,
      ratingData.rating,
      ratingData.reviewCount,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deactivating supplier with ID: ${id}`);
    return this.suppliersService.remove(id);
  }

  @Post('seed')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async seedSuppliers(): Promise<{ message: string }> {
    this.logger.log('Seeding suppliers database');
    await this.suppliersService.seedSuppliers();
    return { message: 'Suppliers seeded successfully' };
  }
}
