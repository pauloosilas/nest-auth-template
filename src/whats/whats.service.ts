import { Injectable } from '@nestjs/common';
import { CreateWhatDto } from './dto/create-what.dto';
import { UpdateWhatDto } from './dto/update-what.dto';

@Injectable()
export class WhatsService {
  create(createWhatDto: CreateWhatDto) {
    return 'This action adds a new what';
  }

  findAll() {
    return `This action returns all whats`;
  }

  findOne(id: number) {
    return `This action returns a #${id} what`;
  }

  update(id: number, updateWhatDto: UpdateWhatDto) {
    return `This action updates a #${id} what`;
  }

  remove(id: number) {
    return `This action removes a #${id} what`;
  }
}
