'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  RefreshCw,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PageContainer } from '@/components/layout/PageContainer';
import { toast } from 'sonner';
import { EVENT_TYPE_LABELS, ATTENDANCE_STATUS_LABELS, ATTENDANCE_STATUS_ICONS } from '@/lib/constants';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { AttendanceStatus, EventType } from '@/types';

// モックデータ
const mockEvent: {
  id: string;
  title: string;
  event_type: EventType;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
} = {
  id: '1',
  title: '1月5日 練習試合',
  event_type: 'game',
  event_date: '2025-01-05',
  start_time: '08:30',
  end_time: '17:00',
  location: '△△球場',
  description: '対戦相手: XX中学校\n集合時間: 8:00\n持ち物: ユニフォーム、お弁当、飲み物',
};

const mockDutyAssignments = [
  { id: '1', category: 'お茶係', user: { name: '山田 太郎', avatar_url: null }, color: '#f97316' },
  { id: '2', category: 'グラウンド整備', user: { name: '佐藤 花子', avatar_url: null }, color: '#fb923c' },
  { id: '3', category: '審判', user: { name: '鈴木 次郎', avatar_url: null }, color: '#fdba74' },
  { id: '4', category: '記録係', user: { name: 'あなた', avatar_url: null, isMe: true }, color: '#ea580c' },
  { id: '5', category: 'アナウンス', user: { name: '田中 三郎', avatar_url: null }, color: '#c2410c' },
];

const mockMyDuty = {
  id: '4',
  category: '記録係',
  color: '#ea580c',
};

// Textareaフォールバック
const TextareaFallback = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [myAttendance, setMyAttendance] = useState<AttendanceStatus>('yes');
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [swapReason, setSwapReason] = useState('');

  const handleAttendanceChange = (status: AttendanceStatus) => {
    setMyAttendance(status);
    toast.success(`出欠を「${ATTENDANCE_STATUS_LABELS[status]}」に変更しました`);
  };

  const handleSwapRequest = () => {
    if (!swapReason.trim()) {
      toast.error('理由を入力してください');
      return;
    }
    // TODO: Supabaseに保存
    toast.success('交代リクエストを送信しました');
    setSwapDialogOpen(false);
    setSwapReason('');
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* イベント情報 */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-0 shadow-md overflow-hidden">
              <div
                className={`h-2 ${
                  mockEvent.event_type === 'practice'
                    ? 'bg-primary'
                    : mockEvent.event_type === 'game'
                    ? 'bg-accent'
                    : 'bg-muted-foreground'
                }`}
              />
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold text-foreground">
                        {mockEvent.title}
                      </h1>
                      <Badge
                        variant="secondary"
                        className={
                          mockEvent.event_type === 'practice'
                            ? 'bg-primary/10 text-primary'
                            : mockEvent.event_type === 'game'
                            ? 'bg-accent/10 text-accent'
                            : 'bg-muted text-muted-foreground'
                        }
                      >
                        {EVENT_TYPE_LABELS[mockEvent.event_type]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(mockEvent.event_date), 'yyyy年M月d日(E)', { locale: ja })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {mockEvent.start_time} - {mockEvent.end_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {mockEvent.location}
                      </span>
                    </div>
                  </div>
                </div>

                {mockEvent.description && (
                  <div className="mt-4 p-4 rounded-lg bg-secondary/50">
                    <p className="text-sm whitespace-pre-wrap">{mockEvent.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* 当番一覧 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  当番一覧
                </CardTitle>
                <CardDescription>このイベントの当番担当者</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockDutyAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        (assignment.user as any).isMe
                          ? 'bg-primary/10 border border-primary/20'
                          : 'bg-secondary/50'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: assignment.color }}
                      />
                      <span className="font-medium text-foreground min-w-[100px]">
                        {assignment.category}
                      </span>
                      <div className="flex items-center gap-2 flex-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={assignment.user.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {assignment.user.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {assignment.user.name}
                          {(assignment.user as any).isMe && (
                            <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary">
                              あなた
                            </Badge>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* サイドバー */}
        <div className="space-y-6">
          {/* あなたの当番 */}
          {mockMyDuty && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card className="border-0 shadow-md border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg">あなたの当番</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: mockMyDuty.color }}
                    />
                    <span className="text-lg font-semibold text-foreground">
                      {mockMyDuty.category}
                    </span>
                  </div>
                  <Dialog open={swapDialogOpen} onOpenChange={setSwapDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        交代をリクエスト
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>交代リクエスト</DialogTitle>
                        <DialogDescription>
                          {mockEvent.title} - {mockMyDuty.category}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="reason">
                            <MessageSquare className="inline mr-1 h-4 w-4" />
                            理由
                          </Label>
                          <TextareaFallback
                            id="reason"
                            placeholder="交代をお願いする理由を入力してください..."
                            value={swapReason}
                            onChange={(e) => setSwapReason(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSwapDialogOpen(false)}>
                          キャンセル
                        </Button>
                        <Button onClick={handleSwapRequest}>
                          リクエストを送信
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* 出欠登録 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">出欠登録</CardTitle>
                <CardDescription>参加予定を選択してください</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {(['yes', 'maybe', 'no'] as AttendanceStatus[]).map((status) => (
                    <Button
                      key={status}
                      variant={myAttendance === status ? 'default' : 'outline'}
                      className={`flex-1 h-12 ${
                        myAttendance === status
                          ? status === 'yes'
                            ? 'bg-green-600 hover:bg-green-700'
                            : status === 'maybe'
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-red-500 hover:bg-red-600'
                          : ''
                      }`}
                      onClick={() => handleAttendanceChange(status)}
                    >
                      <span className="text-lg mr-1">{ATTENDANCE_STATUS_ICONS[status]}</span>
                      {ATTENDANCE_STATUS_LABELS[status]}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageContainer>
  );
}

