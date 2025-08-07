import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessesService {
  create(_createBusinessDto: CreateBusinessDto) {
    return 'This action adds a new business';
  }

  findAll() {
    return `This action returns all businesses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} business`;
  }

  update(id: number, _updateBusinessDto: UpdateBusinessDto) {
    return `This action updates a #${id} business`;
  }

  remove(id: number) {
    return `This action removes a #${id} business`;
  }
}
