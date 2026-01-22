'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CreditCard, Check, Shield, ArrowRight, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function SetupPaymentContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled');

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"
            >
              <CreditCard className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">お支払い設定</CardTitle>
            <div className="flex items-center justify-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Stripeによる安全な決済</span>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {canceled && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg bg-amber-50 p-4 text-center text-sm text-amber-700 border border-amber-200"
              >
                決済がキャンセルされました。再度お試しください。
              </motion.div>
            )}

            {/* Price Card */}
            <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 text-center border border-indigo-100">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-indigo-600">¥9,800</span>
                <span className="text-muted-foreground">/月（税込）</span>
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  3ヶ月無料
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  人数無制限
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-4 w-4 text-green-500" />
                  いつでも解約可
                </span>
              </div>
            </div>

            {/* 更新通知 */}
            <p className="text-center text-sm text-muted-foreground">
              <Mail className="inline h-4 w-4 mr-1" />
              更新前にメールでお知らせ
            </p>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full h-12 text-base bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  処理中...
                </>
              ) : (
                <>
                  カードを登録して始める
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            {/* Terms */}
            <p className="text-center text-xs text-muted-foreground">
              <Link href="/terms" className="underline hover:text-foreground">
                利用規約
              </Link>
              ・
              <Link href="/privacy" className="underline hover:text-foreground">
                プライバシーポリシー
              </Link>
              に同意
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function SetupPaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    }>
      <SetupPaymentContent />
    </Suspense>
  );
}
