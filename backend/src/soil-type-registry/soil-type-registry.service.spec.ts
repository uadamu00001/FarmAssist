import { SoilTypeRegistryService } from './soil-type-registry.service';
import { CreateSoilTypeDto } from './dto/create-soil-type.dto';

describe('SoilTypeRegistryService', () => {
  let service: SoilTypeRegistryService;

  beforeEach(() => {
    service = new SoilTypeRegistryService();
  });

  it('should create a soil type', () => {
    const dto: CreateSoilTypeDto = {
      name: 'Test Soil',
      pH: 6.5,
      drainage: 'moderate',
      fertility: 'high',
      cropCompatibility: ['wheat', 'corn'],
    };
    const result = service.create(dto);
    expect(result).toMatchObject(dto);
    expect(result.id).toBeDefined();
  });

  it('should find all soil types', () => {
    const dto: CreateSoilTypeDto = {
      name: 'Test Soil',
      pH: 6.5,
      drainage: 'moderate',
      fertility: 'high',
      cropCompatibility: ['wheat', 'corn'],
    };
    service.create(dto);
    const all = service.findAll();
    expect(all.length).toBeGreaterThan(0);
  });

  it('should find one soil type by id', () => {
    const dto: CreateSoilTypeDto = {
      name: 'Test Soil',
      pH: 6.5,
      drainage: 'moderate',
      fertility: 'high',
      cropCompatibility: ['wheat', 'corn'],
    };
    const created = service.create(dto);
    const found = service.findOne(created.id);
    expect(found).toMatchObject(dto);
  });

  it('should update a soil type', () => {
    const dto: CreateSoilTypeDto = {
      name: 'Test Soil',
      pH: 6.5,
      drainage: 'moderate',
      fertility: 'high',
      cropCompatibility: ['wheat', 'corn'],
    };
    const created = service.create(dto);
    const updated = service.update(created.id, { name: 'Updated Soil' });
    expect(updated.name).toBe('Updated Soil');
  });

  it('should remove a soil type', () => {
    const dto: CreateSoilTypeDto = {
      name: 'Test Soil',
      pH: 6.5,
      drainage: 'moderate',
      fertility: 'high',
      cropCompatibility: ['wheat', 'corn'],
    };
    const created = service.create(dto);
    service.remove(created.id);
    expect(() => service.findOne(created.id)).toThrow();
  });

  it('should classify soil types with advanced logic', () => {
    expect(service.classify({ pH: 4.5, drainage: 'poor', fertility: 'low', name: '', cropCompatibility: [] })).toBe('Acidic Heavy Clay (Low Fertility)');
    expect(service.classify({ pH: 8, drainage: 'excellent', fertility: 'high', name: '', cropCompatibility: [] })).toBe('Alkaline Sandy (High Fertility)');
    expect(service.classify({ pH: 6.5, drainage: 'moderate', fertility: 'high', name: '', cropCompatibility: [] })).toBe('Ideal Loam');
    expect(service.classify({ pH: 7, drainage: 'poor', fertility: 'medium', name: '', cropCompatibility: [] })).toBe('Clay');
    expect(service.classify({ pH: 7, drainage: 'excellent', fertility: 'medium', name: '', cropCompatibility: [] })).toBe('Sandy');
    expect(service.classify({ pH: 7, drainage: 'moderate', fertility: 'low', name: '', cropCompatibility: [] })).toBe('Infertile Soil');
    expect(service.classify({ pH: 7, drainage: 'moderate', fertility: 'medium', name: '', cropCompatibility: [] })).toBe('General');
  });

  it('should filter by pH range', () => {
    service.create({ name: 'A', pH: 5, drainage: 'poor', fertility: 'low', cropCompatibility: [] });
    service.create({ name: 'B', pH: 7, drainage: 'moderate', fertility: 'medium', cropCompatibility: [] });
    const filtered = service.filterByPhRange(6, 8);
    expect(filtered.some(s => s.name === 'B')).toBe(true);
    expect(filtered.some(s => s.name === 'A')).toBe(false);
  });

  it('should filter by drainage', () => {
    service.create({ name: 'A', pH: 5, drainage: 'poor', fertility: 'low', cropCompatibility: [] });
    service.create({ name: 'B', pH: 7, drainage: 'moderate', fertility: 'medium', cropCompatibility: [] });
    const filtered = service.filterByDrainage('poor');
    expect(filtered.every(s => s.drainage === 'poor')).toBe(true);
  });

  it('should filter by crop compatibility', () => {
    service.create({ name: 'A', pH: 5, drainage: 'poor', fertility: 'low', cropCompatibility: ['rice'] });
    service.create({ name: 'B', pH: 7, drainage: 'moderate', fertility: 'medium', cropCompatibility: ['wheat'] });
    const filtered = service.filterByCrop('wheat');
    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('B');
  });

  it('should suggest crops based on soil properties', () => {
    expect(service.suggestCrops({ pH: 6.5, drainage: 'moderate', fertility: 'high', name: '', cropCompatibility: [] })).toEqual(['wheat', 'corn', 'soybean']);
    expect(service.suggestCrops({ pH: 4.5, drainage: 'poor', fertility: 'low', name: '', cropCompatibility: [] })).toEqual(['potato', 'sweet potato', 'blueberry']);
    expect(service.suggestCrops({ pH: 7, drainage: 'excellent', fertility: 'medium', name: '', cropCompatibility: [] })).toEqual(['carrot', 'peanut', 'watermelon']);
    expect(service.suggestCrops({ pH: 7, drainage: 'moderate', fertility: 'low', name: '', cropCompatibility: [] })).toEqual(['millet', 'sorghum']);
    expect(service.suggestCrops({ pH: 7, drainage: 'moderate', fertility: 'medium', name: '', cropCompatibility: [] })).toEqual(['generic crop']);
  });
});
