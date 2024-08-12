import { Test, TestingModule } from '@nestjs/testing';
import { WhatsService } from './whats.service';

describe('WhatsService', () => {
  let service: WhatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WhatsService],
    }).compile();

    service = module.get<WhatsService>(WhatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
