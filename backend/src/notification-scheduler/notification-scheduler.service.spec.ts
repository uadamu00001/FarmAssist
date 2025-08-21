import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationSchedulerService } from './notification-scheduler.service';
import { Notification } from './notification.entity';
import { Repository } from 'typeorm';

describe('NotificationSchedulerService', () => {
  let service: NotificationSchedulerService;
  let repo: Repository<Notification>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationSchedulerService,
        {
          provide: getRepositoryToken(Notification),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<NotificationSchedulerService>(NotificationSchedulerService);
    repo = module.get<Repository<Notification>>(getRepositoryToken(Notification));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should schedule a notification', async () => {
    jest.spyOn(repo, 'create').mockImplementation((n) => n as any);
    jest.spyOn(repo, 'save').mockResolvedValue({ id: 1, ...{} } as any);
    jest.spyOn(service as any, 'setupTimer').mockImplementation(() => Promise.resolve());
    const notif = await service.schedule({
      to: 'test@example.com',
      channel: 'email',
      subject: 'Test',
      body: 'Body',
      sendAt: new Date(),
      retryCount: 0,
      maxRetries: 3,
      lastErrorCode: 0,
      lastErrorMessage: null,
      recurrence: 'none',
      recurrenceEnd: null,
    });
    expect(notif).toBeDefined();
    expect(notif.to).toBe('test@example.com');
  });
});
