'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday
} from 'date-fns';
import { ja } from 'date-fns/locale';

// モックデータ
const mockEvents = [
  {
    id: '1',
    title: '練習',
    event_type: 'practice',
    event_date: '2024-12-28',
    start_time: '09:00',
    location: '〇〇グラウンド',
    myDuty: 'グラウンド整備',
  },
  {
    id: '2',
    title: '練習試合',
    event_type: 'game',
    event_date: '2025-01-05',
    start_time: '08:30',
    location: '△△球場',
    myDuty: '記録係',
  },
  {
    id: '3',
    title: '練習',
    event_type: 'practice',
    event_date: '2025-01-12',
    start_time: '09:00',
    location: '〇〇グラウンド',
    myDuty: '配車係',
  },
  {
    id: '4',
    title: '公式戦',
    event_type: 'game',
    event_date: '2025-01-19',
    start_time: '10:00',
    location: '□□スタジアム',
    myDuty: null,
  },
];

const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDate = (date: Date) => {
    return mockEvents.filter(event =>
      isSameDay(new Date(event.event_date), date)
    );
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <PageContainer
      title="カレンダー"
      description="予定と当番を確認できます"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* カレンダー */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">
                {format(currentMonth, 'yyyy年 M月', { locale: ja })}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date())}
                >
                  今月
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* 曜日ヘッダー */}
              <div className="grid grid-cols-7 gap-px mb-2">
                {weekDays.map((day, index) => (
                  <div
                    key={day}
                    className={`text-center text-sm font-medium py-2 ${
                      index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-muted-foreground'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* カレンダーグリッド */}
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                {days.map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const dayOfWeek = day.getDay();

                  return (
                    <motion.button
                      key={day.toISOString()}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        min-h-[80px] sm:min-h-[100px] p-2 text-left bg-card transition-colors
                        ${!isCurrentMonth ? 'opacity-40' : ''}
                        ${isSelected ? 'ring-2 ring-primary ring-inset' : ''}
                        ${isToday(day) ? 'bg-primary/5' : ''}
                        hover:bg-secondary/50
                      `}
                    >
                      <div className="flex flex-col h-full">
                        <span className={`
                          text-sm font-medium mb-1
                          ${isToday(day) ? 'bg-primary text-primary-foreground rounded-full w-7 h-7 flex items-center justify-center' : ''}
                          ${dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-foreground'}
                        `}>
                          {format(day, 'd')}
                        </span>
                        <div className="flex-1 space-y-1 overflow-hidden">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs px-1.5 py-0.5 rounded truncate ${
                                event.event_type === 'practice'
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-accent/20 text-accent'
                              }`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{dayEvents.length - 2}件
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 選択日の詳細 */}
        <div>
          <Card className="border-0 shadow-md sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                {selectedDate
                  ? format(selectedDate, 'M月d日(E)', { locale: ja })
                  : '日付を選択'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg bg-secondary/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              event.event_type === 'practice'
                                ? 'bg-primary'
                                : 'bg-accent'
                            }`}
                          />
                          <span className="font-semibold text-foreground">
                            {event.title}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {event.start_time}
                          </p>
                          <p className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {event.location}
                          </p>
                        </div>
                        {event.myDuty && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-1">あなたの当番</p>
                            <Badge
                              variant="secondary"
                              className={
                                event.event_type === 'practice'
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-accent/10 text-accent'
                              }
                            >
                              {event.myDuty}
                            </Badge>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      この日の予定はありません
                    </p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    カレンダーの日付をクリックして
                    <br />
                    詳細を確認できます
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}





