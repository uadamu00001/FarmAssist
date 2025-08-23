export class CreateFeedbackDto {
  userId: string;
  context: 'recommendation' | 'purchase';
  message: string;
  rating?: number;
}
