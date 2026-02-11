import {
  SubscriptionPeriod,
  SubscriptionType,
} from '../../../../generated/prisma';

export class CreateSubscriptionDto {
  type: SubscriptionType;
  period: SubscriptionPeriod;
  userId: number;
  paymentId?: number;
}
