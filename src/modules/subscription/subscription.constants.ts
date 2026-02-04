import { FEATURE, Subscriptions } from './subscription.types';
import {
  SubscriptionPeriod,
  SubscriptionType,
} from '../../../generated/prisma';

export const SUBSCRIPTIONS: Subscriptions = {
  [SubscriptionType.STANDARD]: {
    amounts: {
      [SubscriptionPeriod.MONTH]: 10,
      [SubscriptionPeriod.QUARTER]: 25,
      [SubscriptionPeriod.YEAR]: 100,
    },
    features: [FEATURE.MULTI_ACCESS, FEATURE.WHATSAPP_BOT],
  },
  [SubscriptionType.PRO]: {
    amounts: {
      [SubscriptionPeriod.MONTH]: 50,
      [SubscriptionPeriod.QUARTER]: 140,
      [SubscriptionPeriod.YEAR]: 500,
    },
    features: [
      FEATURE.MULTI_ACCESS,
      FEATURE.WHATSAPP_BOT,
      FEATURE.PUBLIC_API,
      FEATURE.AI,
    ],
  },
};
