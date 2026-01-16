'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Edit,
  Trash2,
  Users,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { MiniCalendar, type CalendarEvent, type EventType } from '@/components/ui/mini-calendar';
import { EVENT_TYPE_LABELS } from '@/lib/constants';
import { format, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';

// モックデータ - 2026年1月〜のイベント
const mockEvents = [
  {
    id: '1',
    title: '練習',
    event_type: 'practice' as const,
    event_date: new Date(2026, 0, 5),
    start_time: '09:00',
    end_time: '12:00',
    location: '〇〇グラウンド',
    meeting_time: '08:45',
  },
  {
    id: '2',
    title: '練習試合',
    event_type: 'game' as const,
    event_date: new Date(2026, 0, 6),
    start_time: '08:30',
    end_time: '17:00',
    location: '△△球場',
    meeting_time: '07:30',
    description: 'vs ○○チーム',
  },
  {
    id: '3',
    title: '練習',
    event_type: 'practice' as const,
    event_date: new Date(2026, 0, 10),
    start_time: '09:00',
    end_time: '12:00',
    location: '〇〇グラウンド',
    meeting_time: '08:45',
  },
  {
    id: '4',
    title: '練習',
    event_type: 'practice' as const,
    event_date: new Date(2026, 0, 11),
    start_time: '09:00',
    end_time: '12:00',
    location: '〇〇グラウンド',
    meeting_time: '08:45',
  },
  {
    id: '5',
    title: '成人の日練習',
    event_type: 'practice' as const,
    event_date: new Date(2026, 0, 12),
    start_time: '09:00',
    end_time: '12:00',
    location: '〇〇グラウンド',
    meeting_time: '08:45',
  },
  {
    id: '6',
    title: '練習',
    event_type: 'practice' as const,
    event_date: new Date(2026, 0, 17),
    start_time: '09:00',
    end_time: '12:00',
    location: '〇〇グラウンド',
    meeting_time: '08:45',
  },
  {
    id: '7',
    title: '練習試合',
    event_type: 'game' as const,
    event_date: new Date(2026, 0, 18),
    start_time: '10:00',
    end_time: '17:00',
    location: '□□スタジアム',
    meeting_time: '09:00',
  },
  {
    id: '8',
    title: '練習',
    event_type: 'practice' as const,
    event_date: new Date(2026, 0, 24),
    start_time: '09:00',
    end_time: '12:00',
    location: '〇〇グラウンド',
    meeting_time: '08:45',
  },
  {
    id: '9',
    title: '新人戦',
    event_type: 'tournament' as const,
    event_date: new Date(2026, 0, 25),
    start_time: '08:00',
    end_time: '18:00',
    location: '県営球場',
    meeting_time: '06:30',
    description: '1回戦 vs △△チーム',
  },
  {
    id: '10',
    title: '保護者会',
    event_type: 'other' as const,
    event_date: new Date(2026, 1, 1),
    start_time: '14:00',
    end_time: '16:00',
    location: '○○公民館',
    meeting_time: '13:45',
    description: '年間スケジュール確認',
  },
];

// イベントタイプのマッピング
const mapEventType = (type: string): EventType => {
  if (type === 'practice') return 'practice';
  if (type === 'game') return 'game';
  if (type === 'tournament') return 'tournament';
  return 'event';
};

// イベントタイプ別のスタイル
const eventTypeStyles: Record<string, { bg: string; border: string }> = {
  practice: { bg: 'bg-primary/5', border: 'border-l-primary' },
  game: { bg: 'bg-green-50', border: 'border-l-green-500' },
  tournament: { bg: 'bg-amber-50', border: 'border-l-amber-500' },
  other: { bg: 'bg-cyan-50', border: 'border-l-cyan-500' },
};

export default function AdminEventsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // カレンダー用のイベントデータを変換
  const calendarEvents: CalendarEvent[] = mockEvents.map(event => ({
    id: event.id,
    title: event.title,
    type: mapEventType(event.event_type),
    date: event.event_date,
  }));

  // 選択された日のイベント
  const selectedDateEvents = selectedDate 
    ? mockEvents.filter(event => isSameDay(event.event_date, selectedDate))
    : [];

  // 直近5件のイベント
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcomingEvents = mockEvents
    .filter(event => event.event_date >= today)
    .sort((a, b) => a.event_date.getTime() - b.event_date.getTime())
    .slice(0, 5);

  return (
    <PageContainer
      title="予定管理"
      description="チームの予定を作成・管理します"
      actions={
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            予定を追加
          </Link>
        </Button>
      }
    >
      {/* カレンダー・予定一覧（アコーディオン風） */}
      <Card className="border-0 shadow-md mb-6 overflow-hidden">
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CalendarIcon className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">カレンダー</span>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${isCalendarOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* 展開時の予定一覧 */}
        {isCalendarOpen && (
          <div className="border-t px-4 py-3 space-y-2">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => {
                const style = eventTypeStyles[event.event_type] || eventTypeStyles.other;
                return (
                  <div
                    key={event.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${style.bg} border-l-4 ${style.border} hover:opacity-80`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {format(event.event_date, 'M/d(E)', { locale: ja })}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.start_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <Link href={`/admin/events/${event.id}/edit`}>
                          <Edit className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CalendarIcon className="mx-auto h-10 w-10 opacity-30 mb-2" />
                <p className="text-sm">予定がありません</p>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* カレンダーセクション（常に表示） */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* カレンダー */}
        <Card className="border-0 shadow-md lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">スケジュール</CardTitle>
            <CardDescription>日付を選択して予定を確認</CardDescription>
          </CardHeader>
          <CardContent>
            <MiniCalendar
              events={calendarEvents}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              showLegend={true}
            />
          </CardContent>
        </Card>

        {/* 選択した日の詳細 or 次の予定 */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {selectedDate 
                ? format(selectedDate, 'M月d日(E)', { locale: ja })
                : '次の予定'
              }
            </CardTitle>
            <CardDescription>
              {selectedDate 
                ? `${selectedDateEvents.length}件の予定`
                : '直近のスケジュール'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* 日付選択時: その日のイベント */}
            {selectedDate && selectedDateEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => {
                  const style = eventTypeStyles[event.event_type] || eventTypeStyles.other;
                  return (
                    <div key={event.id} className={`p-3 rounded-lg border-l-4 ${style.bg} ${style.border}`}>
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <Link href={`/admin/events/${event.id}/edit`}>
                              <Edit className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="font-semibold text-sm mb-1">{event.title}</p>
                      <div className="space-y-0.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.start_time}{event.end_time && ` - ${event.end_time}`}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                        {event.meeting_time && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>集合 {event.meeting_time}</span>
                          </div>
                        )}
                      </div>
                      {event.description && (
                        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
                          {event.description}
                        </p>
                      )}
                    </div>
                  );
                })}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedDate(null)}
                  className="w-full text-xs text-muted-foreground"
                >
                  選択をクリア
                </Button>
              </div>
            ) : selectedDate ? (
              <div className="text-center py-6 text-muted-foreground">
                <CalendarIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">この日は予定がありません</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedDate(null)}
                  className="mt-2 text-xs"
                >
                  選択をクリア
                </Button>
              </div>
            ) : (
              /* デフォルト: 次の予定を表示 */
              <div className="space-y-3">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <CalendarIcon className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">予定がありません</p>
                    <Button asChild className="mt-3">
                      <Link href="/admin/events/new">
                        <Plus className="mr-2 h-4 w-4" />
                        予定を追加
                      </Link>
                    </Button>
                  </div>
                ) : (
                  upcomingEvents.map((event) => {
                    const style = eventTypeStyles[event.event_type] || eventTypeStyles.other;
                    return (
                      <div key={event.id} className={`p-3 rounded-lg border-l-4 ${style.bg} ${style.border}`}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-medium">{format(event.event_date, 'M/d(E)', { locale: ja })}</span>
                            <Badge variant="secondary" className="text-xs">
                              {EVENT_TYPE_LABELS[event.event_type] || event.event_type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                              <Link href={`/admin/events/${event.id}/edit`}>
                                <Edit className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                        <p className="font-semibold text-sm mb-1">{event.title}</p>
                        <div className="space-y-0.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{event.start_time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
