// An "Input" can be a type or interface defining what vendors sell
export interface Input {
  name: string;
  type: 'Fertilizer' | 'Seed' | 'Equipment';
  price: number;
}

export class Vendor {
  id: string;
  name: string;
  location: string;
  inputsSold: Input[];
}
