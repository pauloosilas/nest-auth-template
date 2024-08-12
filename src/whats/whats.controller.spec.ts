import { Test, TestingModule } from '@nestjs/testing';
import { WhatsController } from './whats.controller';
import { WhatsService } from './whats.service';

describe('WhatsController', () => {
  let controller: WhatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WhatsController],
      providers: [WhatsService],
    }).compile();

    controller = module.get<WhatsController>(WhatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
