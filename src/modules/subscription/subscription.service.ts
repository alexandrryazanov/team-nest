import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import {
  SUBSCRIPTION_ADDITIONAL_DAYS,
  SUBSCRIPTIONS,
} from './subscription.constants';
import { PrismaService } from '../prisma/prisma.service';
import { addDays, addMonths, addQuarters, addYears } from 'date-fns';
import { SubscriptionPeriod } from '../../../generated/prisma';

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

  async upsert({ type, period, userId, paymentId }: CreateSubscriptionDto) {
    const existing = await this.prisma.subscription.findUnique({
      where: { userId },
    });

    const { expiresAt, nextChargeAt } = this.calcExpiresAndNextChargeDate(
      period,
      existing ? existing.nextChargeAt : new Date(),
    );

    if (existing) {
      return this.prisma.subscription.create({
        data: {
          type,
          period,
          expiresAt,
          nextChargeAt,
          userId,
          payments: { connect: { id: paymentId } },
        },
      });
    }

    return this.prisma.subscription.update({
      where: { userId },
      data: {
        type,
        period,
        expiresAt,
        nextChargeAt,
        payments: { connect: { id: paymentId } },
      },
    });
  }

  calcExpiresAndNextChargeDate(period: SubscriptionPeriod, date = new Date()) {
    if (period === SubscriptionPeriod.MONTH) {
      return {
        expiresAt: addDays(addMonths(date, 1), SUBSCRIPTION_ADDITIONAL_DAYS),
        nextChargeAt: addMonths(date, 1),
      };
    }
    if (period === SubscriptionPeriod.QUARTER) {
      return {
        expiresAt: addDays(addQuarters(date, 1), SUBSCRIPTION_ADDITIONAL_DAYS),
        nextChargeAt: addQuarters(date, 1),
      };
    }

    return {
      expiresAt: addDays(addYears(date, 1), SUBSCRIPTION_ADDITIONAL_DAYS),
      nextChargeAt: addYears(date, 1),
    };
  }

  findAll() {
    return `This action returns all subscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }
}
