import { Test, TestingModule } from '@nestjs/testing';
import { SoilTypeRegistryController } from './soil-type-registry.controller';
import { SoilTypeRegistryService } from './soil-type-registry.service';
import { CreateSoilTypeDto } from './dto/create-soil-type.dto';

const mockService = {
  create: jest.fn(dto => ({ id: '1', ...dto })),
  findAll: jest.fn(() => [{ id: '1', name: 'Test', pH: 6.5, drainage: 'moderate', fertility: 'high', cropCompatibility: ['wheat'] }]),
  findOne: jest.fn(id => ({ id, name: 'Test', pH: 6.5, drainage: 'moderate', fertility: 'high', cropCompatibility: ['wheat'] })),
  update: jest.fn((id, dto) => ({ id, ...dto })),
  remove: jest.fn(id => undefined),
  classify: jest.fn(() => 'Ideal Loam'),
  filterByPhRange: jest.fn(() => []),
  filterByDrainage: jest.fn(() => []),
  filterByCrop: jest.fn(() => []),
  suggestCrops: jest.fn(() => ['wheat', 'corn']),
};

describe('SoilTypeRegistryController', () => {
  let controller: SoilTypeRegistryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SoilTypeRegistryController],
      providers: [
        { provide: SoilTypeRegistryService, useValue: mockService },
      ],
    }).compile();
    controller = module.get<SoilTypeRegistryController>(SoilTypeRegistryController);
  });

  it('should create a soil type', () => {
    const dto: CreateSoilTypeDto = { name: 'Test', pH: 6.5, drainage: 'moderate', fertility: 'high', cropCompatibility: ['wheat'] };
    expect(controller.create(dto)).toMatchObject(dto);
  });

  it('should get all soil types', () => {
    expect(controller.findAll()).toBeInstanceOf(Array);
  });

  it('should get one soil type', () => {
    expect(controller.findOne('1')).toHaveProperty('id', '1');
  });

  it('should update a soil type', () => {
    expect(controller.update('1', { name: 'Updated' })).toHaveProperty('name', 'Updated');
  });

  it('should remove a soil type', () => {
    expect(controller.remove('1')).toBeUndefined();
  });

  it('should classify a soil type', () => {
    expect(controller.classify({ name: '', pH: 6.5, drainage: 'moderate', fertility: 'high', cropCompatibility: [] })).toBe('Ideal Loam');
  });

  it('should filter by pH range', () => {
    expect(controller.filterByPhRange({ min: 6, max: 7 })).toBeInstanceOf(Array);
  });

  it('should filter by drainage', () => {
    expect(controller.filterByDrainage('moderate')).toBeInstanceOf(Array);
  });

  it('should filter by crop', () => {
    expect(controller.filterByCrop('wheat')).toBeInstanceOf(Array);
  });

  it('should suggest crops', () => {
    expect(controller.suggestCrops({ name: '', pH: 6.5, drainage: 'moderate', fertility: 'high', cropCompatibility: [] })).toEqual(['wheat', 'corn']);
  });
});
