import {
  SubscriptionPeriod,
  SubscriptionType,
} from '../../../generated/prisma';

export enum FEATURE {
  MULTI_ACCESS,
  WHATSAPP_BOT,
  PUBLIC_API,
  AI,
}

export type Subscriptions = {
  [key in SubscriptionType]: {
    amounts: { [key in SubscriptionPeriod]: number };
    features: FEATURE[];
  };
};
