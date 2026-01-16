'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Loader2,
  Save,
  Users,
  Car,
  ClipboardCheck,
  Plus,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { format } from 'date-fns';

// Textareaコンポーネントがない場合のフォールバック
const TextareaFallback = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// モックデータ（実際はAPIから取得）
const mockEvents: Record<string, {
  id: string;
  title: string;
  event_type: EventType;
  event_date: Date;
  start_time: string;
  end_time: string;
  location: string;
  meeting_time: string;
  description?: string;
}> = {
  '1': {
    id: '1',
    title: '練習',
    event_type: 'practice',
    event_date: new Date(2025, 11, 27),
    start_time: '09:00',
    end_time: '12:00',
    location: '〇〇グラウンド',
    meeting_time: '08:45',
  },
  '2': {
    id: '2',
    title: '練習試合',
    event_type: 'game',
    event_date: new Date(2025, 11, 28),
    start_time: '08:30',
    end_time: '17:00',
    location: '△△球場',
    meeting_time: '07:30',
    description: 'vs ○○チーム',
  },
  '3': {
    id: '3',
    title: '初練習',
    event_type: 'practice',
    event_date: new Date(2026, 0, 3),
    start_time: '09:00',
    end_time: '12:00',
    location: '〇〇グラウンド',
    meeting_time: '08:45',
  },
  '4': {
    id: '4',
    title: '新春大会',
    event_type: 'tournament',
    event_date: new Date(2026, 0, 4),
    start_time: '08:00',
    end_time: '18:00',
    location: '○○市営球場',
    meeting_time: '06:30',
    description: '1回戦 vs △△チーム',
  },
};

// モックデータ: メンバー一覧
const members = [
  { id: '1', name: '山田太郎' },
  { id: '2', name: '佐藤花子' },
  { id: '3', name: '鈴木一郎' },
  { id: '4', name: '田中美咲' },
  { id: '5', name: '高橋健太' },
  { id: '6', name: '渡辺優子' },
  { id: '7', name: '伊藤大輔' },
  { id: '8', name: '小林あゆみ' },
];

// モックデータ: 当番カテゴリ
const dutyCategories = [
  { id: '1', name: 'グラウンド整備', color: 'bg-blue-500' },
  { id: '2', name: 'お茶当番', color: 'bg-green-500' },
  { id: '3', name: '審判', color: 'bg-purple-500' },
  { id: '4', name: '記録係', color: 'bg-amber-500' },
  { id: '5', name: 'アナウンス', color: 'bg-pink-500' },
];

// モックデータ: 車両
const vehicles = [
  { id: '1', name: '山田家（7人乗り）', capacity: 7 },
  { id: '2', name: '佐藤家（5人乗り）', capacity: 5 },
  { id: '3', name: '鈴木家（8人乗り）', capacity: 8 },
  { id: '4', name: '田中家（5人乗り）', capacity: 5 },
];

interface DutyAssignment {
  dutyId: string;
  memberId: string;
}

interface VehicleAssignment {
  vehicleId: string;
  passengers: string[];
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'practice' as EventType,
    event_date: '',
    start_time: '',
    end_time: '',
    location: '',
    meeting_time: '',
    description: '',
  });

  // 当番割り当て
  const [dutyAssignments, setDutyAssignments] = useState<DutyAssignment[]>([
    { dutyId: '1', memberId: '1' },
    { dutyId: '2', memberId: '2' },
  ]);

  // 配車割り当て
  const [vehicleAssignments, setVehicleAssignments] = useState<VehicleAssignment[]>([
    { vehicleId: '1', passengers: ['3', '4', '5'] },
    { vehicleId: '2', passengers: ['6', '7'] },
  ]);

  // 既存データを読み込み
  useEffect(() => {
    const event = mockEvents[eventId];
    if (event) {
      setFormData({
        title: event.title,
        event_type: event.event_type,
        event_date: format(event.event_date, 'yyyy-MM-dd'),
        start_time: event.start_time,
        end_time: event.end_time,
        location: event.location,
        meeting_time: event.meeting_time,
        description: event.description || '',
      });
    }
  }, [eventId]);

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
      
      toast.success('予定を更新しました');
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
          予定を編集
        </h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          予定の内容を変更します
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
                  <CardDescription>予定の基本情報を編集してください</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="event_type">
                        種類 <span className="text-destructive">*</span>
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
                    <div className="space-y-2">
                      <Label htmlFor="title">
                        タイトル <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="例: 練習、○○大会 1回戦"
                        value={formData.title}
                        onChange={handleChange}
                        className="h-12"
                        required
                      />
                    </div>
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
                        場所 <span className="text-destructive">*</span>
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

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="start_time">
                        <Clock className="inline mr-1 h-4 w-4" />
                        時間 <span className="text-destructive">*</span>
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
                      <Label htmlFor="end_time" className="text-muted-foreground">
                        〜
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
                    <div className="space-y-2">
                      <Label htmlFor="meeting_time">
                        <Users className="inline mr-1 h-4 w-4" />
                        集合時間
                      </Label>
                      <Input
                        id="meeting_time"
                        name="meeting_time"
                        type="time"
                        value={formData.meeting_time}
                        onChange={handleChange}
                        className="h-12"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg">備考</CardTitle>
                  <CardDescription>追加の情報があれば入力してください</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="description">
                      <FileText className="inline mr-1 h-4 w-4" />
                      メモ
                    </Label>
                    <TextareaFallback
                      id="description"
                      name="description"
                      placeholder="対戦相手や持ち物など..."
                      value={formData.description}
                      onChange={handleChange}
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 当番割り当て */}
              <Card className="border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-primary" />
                      当番割り当て
                    </CardTitle>
                    <CardDescription>この予定の当番を割り当てます</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setDutyAssignments([...dutyAssignments, { dutyId: '', memberId: '' }])}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    追加
                  </Button>
                </CardHeader>
                <CardContent>
                  {dutyAssignments.length > 0 ? (
                    <div className="space-y-3">
                      {dutyAssignments.map((assignment, index) => {
                        const duty = dutyCategories.find(d => d.id === assignment.dutyId);
                        const member = members.find(m => m.id === assignment.memberId);
                        return (
                          <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-secondary/30">
                            <Select
                              value={assignment.dutyId}
                              onValueChange={(value) => {
                                const newAssignments = [...dutyAssignments];
                                newAssignments[index].dutyId = value;
                                setDutyAssignments(newAssignments);
                              }}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="当番を選択" />
                              </SelectTrigger>
                              <SelectContent>
                                {dutyCategories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-2 h-2 rounded-full ${cat.color}`} />
                                      {cat.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={assignment.memberId}
                              onValueChange={(value) => {
                                const newAssignments = [...dutyAssignments];
                                newAssignments[index].memberId = value;
                                setDutyAssignments(newAssignments);
                              }}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="担当者を選択" />
                              </SelectTrigger>
                              <SelectContent>
                                {members.map((m) => (
                                  <SelectItem key={m.id} value={m.id}>
                                    {m.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                setDutyAssignments(dutyAssignments.filter((_, i) => i !== index));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      当番が割り当てられていません
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* 配車割り当て */}
              <Card className="border-0 shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Car className="h-5 w-5 text-primary" />
                      配車割り当て
                    </CardTitle>
                    <CardDescription>この予定の配車を設定します</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => setVehicleAssignments([...vehicleAssignments, { vehicleId: '', passengers: [] }])}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    追加
                  </Button>
                </CardHeader>
                <CardContent>
                  {vehicleAssignments.length > 0 ? (
                    <div className="space-y-4">
                      {vehicleAssignments.map((assignment, index) => {
                        const vehicle = vehicles.find(v => v.id === assignment.vehicleId);
                        return (
                          <div key={index} className="p-3 rounded-lg bg-secondary/30 space-y-3">
                            <div className="flex items-center gap-2">
                              <Select
                                value={assignment.vehicleId}
                                onValueChange={(value) => {
                                  const newAssignments = [...vehicleAssignments];
                                  newAssignments[index].vehicleId = value;
                                  setVehicleAssignments(newAssignments);
                                }}
                              >
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="車両を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                  {vehicles.map((v) => (
                                    <SelectItem key={v.id} value={v.id}>
                                      <div className="flex items-center gap-2">
                                        <Car className="h-4 w-4" />
                                        {v.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => {
                                  setVehicleAssignments(vehicleAssignments.filter((_, i) => i !== index));
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            {vehicle && (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="text-xs text-muted-foreground">
                                    乗車メンバー ({assignment.passengers.length}/{vehicle.capacity}人)
                                  </Label>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  {assignment.passengers.map((passengerId) => {
                                    const passenger = members.find(m => m.id === passengerId);
                                    return passenger ? (
                                      <Badge
                                        key={passengerId}
                                        variant="secondary"
                                        className="text-xs cursor-pointer hover:bg-destructive/20"
                                        onClick={() => {
                                          const newAssignments = [...vehicleAssignments];
                                          newAssignments[index].passengers = assignment.passengers.filter(p => p !== passengerId);
                                          setVehicleAssignments(newAssignments);
                                        }}
                                      >
                                        {passenger.name}
                                        <X className="h-3 w-3 ml-1" />
                                      </Badge>
                                    ) : null;
                                  })}
                                  <Select
                                    value=""
                                    onValueChange={(value) => {
                                      if (value && !assignment.passengers.includes(value)) {
                                        const newAssignments = [...vehicleAssignments];
                                        newAssignments[index].passengers = [...assignment.passengers, value];
                                        setVehicleAssignments(newAssignments);
                                      }
                                    }}
                                  >
                                    <SelectTrigger className="h-6 w-20 text-xs border-dashed">
                                      <Plus className="h-3 w-3" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {members
                                        .filter(m => !assignment.passengers.includes(m.id))
                                        .map((m) => (
                                          <SelectItem key={m.id} value={m.id}>
                                            {m.name}
                                          </SelectItem>
                                        ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      配車が設定されていません
                    </p>
                  )}
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
                              ? 'bg-green-500'
                              : formData.event_type === 'tournament'
                              ? 'bg-amber-500'
                              : 'bg-cyan-500'
                          }`}
                        />
                        <span className="text-sm font-medium text-muted-foreground">
                          {EVENT_TYPE_LABELS[formData.event_type]}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">
                        {formData.title || 'タイトル'}
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
                      {formData.meeting_time && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Users className="h-3.5 w-3.5" />
                          集合 {formData.meeting_time}
                        </p>
                      )}
                      {formData.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {formData.location}
                        </p>
                      )}
                      {formData.description && (
                        <p className="text-sm text-muted-foreground mt-2 pt-2 border-t">
                          {formData.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button type="submit" className="w-full h-12" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            保存中...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            変更を保存
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


