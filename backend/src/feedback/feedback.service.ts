import { Injectable } from '@nestjs/common';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  private feedbacks: Feedback[] = [];
  private idCounter = 1;

  create(createFeedbackDto: CreateFeedbackDto): Feedback {
    const feedback: Feedback = {
      id: this.idCounter++,
      ...createFeedbackDto,
      createdAt: new Date(),
    };
    this.feedbacks.push(feedback);
    return feedback;
  }

  findAll(): Feedback[] {
    return this.feedbacks;
  }
}
