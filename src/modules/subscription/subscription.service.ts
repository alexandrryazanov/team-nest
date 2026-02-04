import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SUBSCRIPTIONS } from './subscription.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return SUBSCRIPTIONS;
  }

  async getByUserId(userId: number) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { userId },
      select: {
        type: true,
        status: true,
        period: true,
        expiresAt: true,
        nextChargeAt: true,
      },
    });

    return subscription || null;
  }

  create(createSubscriptionDto: CreateSubscriptionDto) {
    return 'This action addss a new subscription';
  }

  findAll() {
    return `This action returns all subscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
