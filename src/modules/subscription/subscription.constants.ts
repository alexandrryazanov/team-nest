import { FEATURE, Subscriptions } from './subscription.types';
import {
  SubscriptionPeriod,
  SubscriptionType,
} from '../../../generated/prisma';

export const SUBSCRIPTIONS: Subscriptions = {
  [SubscriptionType.STANDARD]: {
    amountsInCents: {
      [SubscriptionPeriod.MONTH]: 1000,
      [SubscriptionPeriod.QUARTER]: 2500,
      [SubscriptionPeriod.YEAR]: 10000,
    },
    features: [FEATURE.MULTI_ACCESS, FEATURE.WHATSAPP_BOT],
  },
  [SubscriptionType.PRO]: {
    amountsInCents: {
      [SubscriptionPeriod.MONTH]: 5000,
      [SubscriptionPeriod.QUARTER]: 14000,
      [SubscriptionPeriod.YEAR]: 50000,
    },
    features: [
      FEATURE.MULTI_ACCESS,
      FEATURE.WHATSAPP_BOT,
      FEATURE.PUBLIC_API,
      FEATURE.AI,
    ],
  },
};
