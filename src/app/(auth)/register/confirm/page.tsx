'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function ConfirmContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center pb-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600"
          >
            <Mail className="h-8 w-8 text-white" />
          </motion.div>
          <CardTitle className="text-2xl font-bold">メールを確認してください</CardTitle>
          <CardDescription className="text-base">
            ご登録ありがとうございます！
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* メール送信先 */}
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 p-6 text-center border border-indigo-100">
            <p className="text-sm text-muted-foreground mb-2">確認メールを送信しました</p>
            <p className="font-medium text-lg text-foreground break-all">
              {email || 'ご登録のメールアドレス'}
            </p>
          </div>

          {/* 手順 */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                1
              </div>
              <div>
                <p className="font-medium">メール内のリンクをクリック</p>
                <p className="text-sm text-muted-foreground">
                  メールアドレスの確認が完了します
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                2
              </div>
              <div>
                <p className="font-medium">ログインする</p>
                <p className="text-sm text-muted-foreground">
                  登録したメールアドレスとパスワードでログイン
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-medium text-indigo-600">
                3
              </div>
              <div>
                <p className="font-medium">お支払い設定</p>
                <p className="text-sm text-muted-foreground">
                  クレジットカードを登録して利用開始！
                </p>
              </div>
            </div>
          </div>

          {/* ログインボタン */}
          <Button asChild className="w-full h-12 text-base">
            <Link href="/login">
              ログインページへ
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          {/* メールが届かない場合 */}
          <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
            <p className="text-sm font-medium text-amber-800 mb-2">
              📧 メールが届かない場合
            </p>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>・迷惑メールフォルダを確認してください</li>
              <li>・数分待ってから再度確認してください</li>
              <li>・メールアドレスに間違いがないか確認してください</li>
            </ul>
          </div>

          {/* 再送信リンク */}
          <p className="text-center text-sm text-muted-foreground">
            メールが届かない場合は
            <Link href="/register" className="text-primary hover:underline ml-1">
              再度登録
            </Link>
            してください
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function RegisterConfirmPage() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ConfirmContent />
    </Suspense>
  );
}
