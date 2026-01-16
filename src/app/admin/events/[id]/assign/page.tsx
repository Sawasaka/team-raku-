'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Save,
  Loader2,
  User,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageContainer } from '@/components/layout/PageContainer';
import { toast } from 'sonner';
import { EVENT_TYPE_LABELS } from '@/lib/constants';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { EventType } from '@/types';

// モックデータ
const mockEvent: {
  id: string;
  title: string;
  event_type: EventType;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
} = {
  id: '1',
  title: '1月5日 練習試合',
  event_type: 'game',
  event_date: '2025-01-05',
  start_time: '08:30',
  end_time: '17:00',
  location: '△△球場',
};

const mockCategories = [
  { id: '1', name: 'お茶係', color: '#f97316' },
  { id: '2', name: 'グラウンド整備', color: '#fb923c' },
  { id: '3', name: '審判', color: '#fdba74' },
  { id: '4', name: '記録係', color: '#ea580c' },
  { id: '5', name: 'アナウンス', color: '#c2410c' },
  { id: '6', name: '配車係', color: '#9a3412' },
  { id: '7', name: '道具係', color: '#7c2d12' },
  { id: '8', name: '炊き出し', color: '#fed7aa' },
];

const mockMembers = [
  { id: '1', name: '山田 太郎', email: 'yamada@example.com', avatar_url: null },
  { id: '2', name: '佐藤 花子', email: 'sato@example.com', avatar_url: null },
  { id: '3', name: '鈴木 次郎', email: 'suzuki@example.com', avatar_url: null },
  { id: '4', name: '田中 三郎', email: 'tanaka@example.com', avatar_url: null },
  { id: '5', name: '高橋 四郎', email: 'takahashi@example.com', avatar_url: null },
  { id: '6', name: '渡辺 五郎', email: 'watanabe@example.com', avatar_url: null },
  { id: '7', name: '伊藤 六郎', email: 'ito@example.com', avatar_url: null },
  { id: '8', name: '山本 七郎', email: 'yamamoto@example.com', avatar_url: null },
];

interface Assignment {
  categoryId: string;
  userId: string | null;
}

export default function AssignDutyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>(
    mockCategories.map(c => ({ categoryId: c.id, userId: null }))
  );

  const handleAssignmentChange = (categoryId: string, userId: string | null) => {
    setAssignments(prev =>
      prev.map(a =>
        a.categoryId === categoryId ? { ...a, userId } : a
      )
    );
  };

  const getAssignedUser = (categoryId: string) => {
    const assignment = assignments.find(a => a.categoryId === categoryId);
    if (!assignment?.userId) return null;
    return mockMembers.find(m => m.id === assignment.userId);
  };

  const getAssignmentCount = (userId: string) => {
    return assignments.filter(a => a.userId === userId).length;
  };

  const assignedCount = assignments.filter(a => a.userId).length;
  const totalCount = assignments.length;

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // TODO: Supabaseに保存
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('当番を保存しました');
      router.push('/admin/events');
    } catch (error) {
      toast.error('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            戻る
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          当番割り当て
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          各役割にメンバーを割り当てます
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* イベント情報 */}
        <div className="lg:col-span-3">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-2 h-full min-h-[60px] rounded-full ${
                      mockEvent.event_type === 'practice'
                        ? 'bg-primary'
                        : 'bg-accent'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-foreground">
                        {mockEvent.title}
                      </h2>
                      <Badge
                        variant="secondary"
                        className={
                          mockEvent.event_type === 'practice'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-accent/10 text-accent'
                        }
                      >
                        {EVENT_TYPE_LABELS[mockEvent.event_type]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(mockEvent.event_date), 'M月d日(E)', { locale: ja })}
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
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      assignedCount === totalCount
                        ? 'text-green-600'
                        : assignedCount === 0
                        ? 'text-red-500'
                        : 'text-yellow-600'
                    }`}>
                      {assignedCount}/{totalCount}
                    </div>
                    <p className="text-xs text-muted-foreground">割当完了</p>
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
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 当番割り当て */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">役割と担当者</CardTitle>
              <CardDescription>各役割にメンバーを割り当ててください</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCategories.map((category, index) => {
                  const assignedUser = getAssignedUser(category.id);
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg bg-secondary/30"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium text-foreground">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={assignments.find(a => a.categoryId === category.id)?.userId || 'none'}
                          onValueChange={(value) =>
                            handleAssignmentChange(
                              category.id,
                              value === 'none' ? null : value
                            )
                          }
                        >
                          <SelectTrigger className="w-full sm:w-48">
                            <SelectValue placeholder="担当者を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">未割当</SelectItem>
                            {mockMembers.map((member) => (
                              <SelectItem key={member.id} value={member.id}>
                                <div className="flex items-center gap-2">
                                  <span>{member.name}</span>
                                  {getAssignmentCount(member.id) > 0 && (
                                    <Badge variant="secondary" className="text-xs">
                                      {getAssignmentCount(member.id)}件
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {assignedUser ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* メンバー一覧 */}
        <div>
          <Card className="border-0 shadow-md sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">メンバー</CardTitle>
              <CardDescription>割当状況を確認</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockMembers.map((member) => {
                  const count = getAssignmentCount(member.id);
                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {member.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {member.name}
                        </p>
                      </div>
                      <Badge
                        variant={count > 0 ? 'default' : 'secondary'}
                        className={count > 0 ? 'bg-primary' : ''}
                      >
                        {count}件
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

