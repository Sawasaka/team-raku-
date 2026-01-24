'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings,
  Save,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Users,
  CreditCard,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

// モックデータ
const mockTeam = {
  name: 'チーム楽サンプル',
  invite_token: 'sample-invite-token-123',
  member_count: 15,
};

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [teamName, setTeamName] = useState(mockTeam.name);
  const [copied, setCopied] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  const inviteLink = `https://team-raku.vercel.app/register?invite=${mockTeam.invite_token}`;

  useEffect(() => {
    // ユーザーのサブスクリプション状態を取得
    const fetchSubscriptionStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('subscription_status')
          .eq('id', user.id)
          .single();
        
        if (data?.subscription_status) {
          setSubscriptionStatus(data.subscription_status);
        }
      }
    };
    
    fetchSubscriptionStatus();
  }, []);

  const handleSave = async () => {
    if (!teamName.trim()) {
      toast.error('チーム名を入力してください');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Supabaseに保存
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('設定を保存しました');
    } catch (error) {
      toast.error('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('招待リンクをコピーしました');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('コピーに失敗しました');
    }
  };

  const handleRegenerateToken = () => {
    if (!confirm('招待リンクを再生成すると、以前のリンクは無効になります。続けますか？')) return;
    // TODO: 新しいトークンを生成
    toast.success('招待リンクを再生成しました');
  };

  const handleManageSubscription = async () => {
    setIsPortalLoading(true);
    
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.error) {
        toast.error(data.error);
        return;
      }
      
      // Stripeポータルへリダイレクト
      window.location.href = data.url;
    } catch (error) {
      toast.error('エラーが発生しました');
    } finally {
      setIsPortalLoading(false);
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'trialing':
        return { text: 'トライアル中', color: 'text-blue-600 bg-blue-50' };
      case 'active':
        return { text: 'アクティブ', color: 'text-green-600 bg-green-50' };
      case 'canceled':
        return { text: 'キャンセル済み', color: 'text-red-600 bg-red-50' };
      case 'past_due':
        return { text: '支払い遅延', color: 'text-orange-600 bg-orange-50' };
      default:
        return { text: '未設定', color: 'text-gray-600 bg-gray-50' };
    }
  };

  const statusLabel = getStatusLabel(subscriptionStatus);

  return (
    <PageContainer
      title="チーム設定"
      description="チームの基本設定を管理します"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl space-y-6"
      >
        {/* サブスクリプション管理 */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              サブスクリプション管理
            </CardTitle>
            <CardDescription>
              プランの変更、支払い方法の更新、請求履歴の確認ができます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">現在のステータス:</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusLabel.color}`}>
                  {statusLabel.text}
                </span>
              </div>
            </div>
            <Button 
              onClick={handleManageSubscription} 
              disabled={isPortalLoading}
              className="w-full"
            >
              {isPortalLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  読み込み中...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  サブスクリプションを管理
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              ※ Stripeの安全なポータルで管理できます
            </p>
          </CardContent>
        </Card>

        {/* チーム情報 */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              基本情報
            </CardTitle>
            <CardDescription>チーム名などの基本設定</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">チーム名</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{mockTeam.member_count}人のメンバー</span>
              </div>
            </div>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  保存
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 招待リンク */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">招待リンク</CardTitle>
            <CardDescription>
              このリンクを共有して新しいメンバーを招待できます
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={inviteLink}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant={copied ? 'secondary' : 'outline'}
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleRegenerateToken}
              className="text-muted-foreground"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              リンクを再生成
            </Button>
            <p className="text-xs text-muted-foreground">
              ※ リンクを再生成すると、以前のリンクは無効になります
            </p>
          </CardContent>
        </Card>

        {/* 危険な操作 */}
        <Card className="border-0 shadow-md border-destructive/20">
          <CardHeader>
            <CardTitle className="text-lg text-destructive">危険な操作</CardTitle>
            <CardDescription>
              これらの操作は取り消せません
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" disabled>
              チームを削除
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              ※ チームの削除は現在サポートされていません
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </PageContainer>
  );
}
