import {
  SubscriptionPeriod,
  SubscriptionType,
} from '../../../generated/prisma';

export enum FEATURE {
  MULTI_ACCESS = 'MULTI_ACCESS',
  WHATSAPP_BOT = 'WHATSAPP_BOT',
  PUBLIC_API = 'PUBLIC_API',
  AI = 'AI',
}

export type Subscriptions = {
  [key in SubscriptionType]: {
    amountsInCents: { [key in SubscriptionPeriod]: number };
    features: FEATURE[];
  };
};
