import { Injectable } from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { Farm } from './entities/farm.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class FarmsService {
  // Using an in-memory array as a mock database
  private readonly farms: Farm[] = [];

  /**
   * Creates a new farm and associates it with the owner.
   * @param createFarmDto The farm data from the request body.
   * @param userId The ID of the authenticated user creating the farm.
   * @returns The newly created farm object.
   */
  create(createFarmDto: CreateFarmDto, userId: string): Farm {
    const newFarm: Farm = {
      id: randomUUID(),
      ownerId: userId,
      ...createFarmDto,
      createdAt: new Date(),
    };
    this.farms.push(newFarm);
    console.log('Current Farms in DB:', this.farms); // For debugging
    return newFarm;
  }

  // Helper method to find farms by owner, useful for testing and future features
  findByOwner(userId: string): Farm[] {
    return this.farms.filter((farm) => farm.ownerId === userId);
  }
}
