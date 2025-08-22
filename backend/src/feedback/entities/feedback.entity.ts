export class Feedback {
  id: number;
  userId: string;
  context: 'recommendation' | 'purchase';
  message: string;
  rating?: number;
  createdAt: Date;
}
