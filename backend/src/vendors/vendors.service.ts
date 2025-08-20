import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { Vendor } from './entities/vendor.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class VendorsService {
  // Using an in-memory array as a mock database
  private readonly vendors: Vendor[] = [
    {
      id: 'vendor-1',
      name: 'Agro Supplies Inc.',
      location: 'New York',
      inputsSold: [{ name: 'NPK 15-15-15', type: 'Fertilizer', price: 50 }],
    },
  ];

  create(createVendorDto: CreateVendorDto): Vendor {
    const newVendor: Vendor = {
      id: randomUUID(),
      ...createVendorDto,
    };
    this.vendors.push(newVendor);
    return newVendor;
  }

  findAll(): Vendor[] {
    return this.vendors;
  }

  findOne(id: string): Vendor {
    const vendor = this.vendors.find((v) => v.id === id);
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID "${id}" not found.`);
    }
    return vendor;
  }

  update(id: string, updateVendorDto: UpdateVendorDto): Vendor {
    const vendor = this.findOne(id);
    const vendorIndex = this.vendors.findIndex((v) => v.id === id);
    const updatedVendor = { ...vendor, ...updateVendorDto };

    this.vendors[vendorIndex] = updatedVendor;
    return updatedVendor;
  }

  remove(id: string): { message: string } {
    const vendorIndex = this.vendors.findIndex((v) => v.id === id);
    if (vendorIndex === -1) {
      throw new NotFoundException(`Vendor with ID "${id}" not found.`);
    }
    this.vendors.splice(vendorIndex, 1);
    return { message: `Vendor with ID "${id}" successfully deleted.` };
  }
}
