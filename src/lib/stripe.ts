import { loadStripe } from '@stripe/stripe-js';

// Stripeのpublishable keyを使用してクライアントを初期化
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};
