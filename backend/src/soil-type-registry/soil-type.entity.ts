export class SoilType {
  id: string;
  name: string;
  pH: number;
  drainage: 'poor' | 'moderate' | 'excellent';
  fertility: 'low' | 'medium' | 'high';
  cropCompatibility: string[];
}
