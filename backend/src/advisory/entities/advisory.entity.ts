export class Advisory {
  id: number;
  type: 'farming-tip' | 'pest-alert' | 'climate-advisory';
  content: string;
  region: string;
  language: string;
  date: Date;
}
