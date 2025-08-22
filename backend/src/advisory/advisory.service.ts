import { Injectable } from '@nestjs/common';
import { Advisory } from './entities/advisory.entity';

@Injectable()
export class AdvisoryService {
  private advisories: Advisory[] = [
    {
      id: 1,
      type: 'farming-tip',
      content: 'Rotate your crops to improve soil health.',
      region: 'East Africa',
      language: 'en',
      date: new Date('2025-08-01'),
    },
    {
      id: 2,
      type: 'pest-alert',
      content: 'Armyworm outbreak expected in your area.',
      region: 'East Africa',
      language: 'en',
      date: new Date('2025-08-15'),
    },
  ];

  findAll(type?: string, region?: string, language?: string): Advisory[] {
    return this.advisories.filter(a =>
      (!type || a.type === type) &&
      (!region || a.region === region) &&
      (!language || a.language === language)
    );
  }
}
