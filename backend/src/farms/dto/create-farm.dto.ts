export class Farm {
  id: string;
  ownerId: string; // To associate the farm with the user who registered it
  cropType: string;
  location: string;
  sizeInAcres: number;
  createdAt: Date;
}
