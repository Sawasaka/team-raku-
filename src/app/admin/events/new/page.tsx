'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Loader2,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import type { EventType } from '@/types';

// Textareaコンポーネントがない場合のフォールバック
const TextareaFallback = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

export default function NewEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'practice' as EventType,
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.event_date) {
      toast.error('必須項目を入力してください');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Supabaseに保存
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('イベントを作成しました');
      router.push('/admin/events');
    } catch (error) {
      toast.error('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          新規イベント作成
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          練習や試合の予定を作成します
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* メインフォーム */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">基本情報</CardTitle>
                  <CardDescription>イベントの基本情報を入力してください</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      イベント名 <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="例: 1月5日 練習試合"
                      value={formData.title}
                      onChange={handleChange}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event_type">
                      イベント種類 <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.event_type}
                      onValueChange={(value: EventType) =>
                        setFormData((prev) => ({ ...prev, event_type: value }))
                      }
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="event_date">
                        <Calendar className="inline mr-1 h-4 w-4" />
                        日付 <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="event_date"
                        name="event_date"
                        type="date"
                        value={formData.event_date}
                        onChange={handleChange}
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">
                        <MapPin className="inline mr-1 h-4 w-4" />
                        場所
                      </Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="例: 〇〇グラウンド"
                        value={formData.location}
                        onChange={handleChange}
                        className="h-12"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="start_time">
                        <Clock className="inline mr-1 h-4 w-4" />
                        開始時間
                      </Label>
                      <Input
                        id="start_time"
                        name="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={handleChange}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_time">
                        <Clock className="inline mr-1 h-4 w-4" />
                        終了時間
                      </Label>
                      <Input
                        id="end_time"
                        name="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={handleChange}
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">詳細情報</CardTitle>
                  <CardDescription>追加の情報があれば入力してください</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      <FileText className="inline mr-1 h-4 w-4" />
                      メモ・備考
                    </Label>
                    <TextareaFallback
                      id="description"
                      name="description"
                      placeholder="持ち物や注意事項など..."
                      value={formData.description}
                      onChange={handleChange}
                      className="min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* サイドバー */}
            <div className="space-y-6">
              <Card className="border-0 shadow-md sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">プレビュー</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-secondary/50">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            formData.event_type === 'practice'
                              ? 'bg-primary'
                              : formData.event_type === 'game'
                              ? 'bg-accent'
                              : 'bg-muted-foreground'
                          }`}
                        />
                        <span className="text-sm font-medium text-muted-foreground">
                          {EVENT_TYPE_LABELS[formData.event_type]}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {formData.title || 'イベント名'}
                      </h3>
                      {formData.event_date && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formData.event_date}
                        </p>
                      )}
                      {formData.start_time && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3.5 w-3.5" />
                          {formData.start_time}
                          {formData.end_time && ` - ${formData.end_time}`}
                        </p>
                      )}
                      {formData.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {formData.location}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button type="submit" className="w-full h-12" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            作成中...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            イベントを作成
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => router.back()}
                      >
                        キャンセル
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </motion.div>
    </PageContainer>
  );
}





