'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  Bell, 
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Clock,
  MapPin,
  Users,
  Car,
  ClipboardCheck,
  Check,
  Settings,
  Package,
  RefreshCw,
  MessageCircle,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageContainer } from '@/components/layout/PageContainer';
import { mockDutyCategoryGroups, mockDutyCategories } from '@/lib/mock-data';
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
  isToday,
  isTomorrow
} from 'date-fns';
import { ja } from 'date-fns/locale';

// モックデータ - 統計

// イベントタイプ
type EventType = 'practice' | 'game' | 'tournament' | 'event';

// イベントタイプ別のスタイル
const eventTypeStyles: Record<EventType, { bg: string; border: string; dot: string }> = {
  practice: { bg: 'bg-primary/5', border: 'border-l-primary', dot: 'bg-primary' },
  game: { bg: 'bg-green-50', border: 'border-l-green-500', dot: 'bg-green-500' },
  tournament: { bg: 'bg-amber-50', border: 'border-l-amber-500', dot: 'bg-amber-500' },
  event: { bg: 'bg-cyan-50', border: 'border-l-cyan-500', dot: 'bg-cyan-500' },
};

// モックデータ - 土日祝中心のスケジュール（2025年12月〜2026年）
const events = [
  // 2025年12月
  { id: '1', title: '練習', type: 'practice' as EventType, date: new Date(2025, 11, 27), time: '09:00', location: '〇〇グラウンド', hasDuty: true, dutyName: 'グラウンド整備', hasVehicle: false },
  { id: '2', title: '練習試合', type: 'game' as EventType, date: new Date(2025, 11, 28), time: '08:30', location: '△△球場', hasDuty: false, dutyName: null, hasVehicle: true },
  
  // 2026年1月
  { id: '3', title: '初練習', type: 'practice' as EventType, date: new Date(2026, 0, 3), time: '09:00', location: '〇〇グラウンド', hasDuty: true, dutyName: 'お茶当番', hasVehicle: false },
  { id: '4', title: '新春大会', type: 'tournament' as EventType, date: new Date(2026, 0, 4), time: '08:00', location: '○○市営球場', hasDuty: true, dutyName: '記録係', hasVehicle: true },
  { id: '5', title: '練習', type: 'practice' as EventType, date: new Date(2026, 0, 10), time: '09:00', location: '〇〇グラウンド', hasDuty: false, dutyName: null, hasVehicle: false },
  { id: '6', title: '練習', type: 'practice' as EventType, date: new Date(2026, 0, 11), time: '09:00', location: '〇〇グラウンド', hasDuty: true, dutyName: '配車係', hasVehicle: false },
  { id: '7', title: '成人の日練習', type: 'practice' as EventType, date: new Date(2026, 0, 12), time: '09:00', location: '〇〇グラウンド', hasDuty: false, dutyName: null, hasVehicle: false },
  { id: '8', title: '練習', type: 'practice' as EventType, date: new Date(2026, 0, 17), time: '09:00', location: '〇〇グラウンド', hasDuty: true, dutyName: 'グラウンド整備', hasVehicle: false },
  { id: '9', title: '練習試合', type: 'game' as EventType, date: new Date(2026, 0, 18), time: '10:00', location: '□□スタジアム', hasDuty: false, dutyName: null, hasVehicle: true },
  { id: '10', title: '練習', type: 'practice' as EventType, date: new Date(2026, 0, 24), time: '09:00', location: '〇〇グラウンド', hasDuty: false, dutyName: null, hasVehicle: false },
  { id: '11', title: '新人戦', type: 'tournament' as EventType, date: new Date(2026, 0, 25), time: '08:00', location: '県営球場', hasDuty: true, dutyName: 'お茶当番', hasVehicle: true },
  { id: '12', title: '練習', type: 'practice' as EventType, date: new Date(2026, 0, 31), time: '09:00', location: '〇〇グラウンド', hasDuty: false, dutyName: null, hasVehicle: false },
  
  // 2026年2月
  { id: '13', title: '保護者会', type: 'event' as EventType, date: new Date(2026, 1, 1), time: '14:00', location: '〇〇公民館', hasDuty: false, dutyName: null, hasVehicle: false },
  { id: '14', title: '練習', type: 'practice' as EventType, date: new Date(2026, 1, 7), time: '09:00', location: '〇〇グラウンド', hasDuty: true, dutyName: '配車係', hasVehicle: false },
  { id: '15', title: '練習試合', type: 'game' as EventType, date: new Date(2026, 1, 8), time: '08:30', location: '△△球場', hasDuty: false, dutyName: null, hasVehicle: true },
  { id: '16', title: '卒団式', type: 'event' as EventType, date: new Date(2026, 1, 11), time: '13:00', location: '〇〇ホール', hasDuty: true, dutyName: '受付', hasVehicle: false },
  { id: '17', title: '練習', type: 'practice' as EventType, date: new Date(2026, 1, 14), time: '09:00', location: '〇〇グラウンド', hasDuty: true, dutyName: 'グラウンド整備', hasVehicle: false },
  { id: '18', title: '春季大会', type: 'tournament' as EventType, date: new Date(2026, 1, 15), time: '09:00', location: '□□スタジアム', hasDuty: true, dutyName: '記録係', hasVehicle: true },
  { id: '19', title: '練習', type: 'practice' as EventType, date: new Date(2026, 1, 21), time: '09:00', location: '〇〇グラウンド', hasDuty: false, dutyName: null, hasVehicle: false },
  { id: '20', title: '練習', type: 'practice' as EventType, date: new Date(2026, 1, 22), time: '09:00', location: '〇〇グラウンド', hasDuty: true, dutyName: 'お茶当番', hasVehicle: false },
  { id: '21', title: '天皇誕生日練習', type: 'practice' as EventType, date: new Date(2026, 1, 23), time: '09:00', location: '〇〇グラウンド', hasDuty: false, dutyName: null, hasVehicle: false },
  { id: '22', title: '練習', type: 'practice' as EventType, date: new Date(2026, 1, 28), time: '09:00', location: '〇〇グラウンド', hasDuty: false, dutyName: null, hasVehicle: false },
  
  // 2026年3月
  { id: '23', title: 'BBQ', type: 'event' as EventType, date: new Date(2026, 2, 1), time: '11:00', location: '〇〇公園', hasDuty: true, dutyName: '買い出し', hasVehicle: false },
  { id: '24', title: '練習', type: 'practice' as EventType, date: new Date(2026, 2, 7), time: '09:00', location: '〇〇グラウンド', hasDuty: false, dutyName: null, hasVehicle: false },
  { id: '25', title: '練習試合', type: 'game' as EventType, date: new Date(2026, 2, 8), time: '08:30', location: '△△球場', hasDuty: true, dutyName: '記録係', hasVehicle: true },
];

// 祝日リスト（2025-2026年）
const holidays = [
  new Date(2026, 0, 1),   // 元日
  new Date(2026, 0, 12),  // 成人の日
  new Date(2026, 1, 11),  // 建国記念日
  new Date(2026, 1, 23),  // 天皇誕生日
  new Date(2026, 2, 20),  // 春分の日
];

// 土日祝かどうかを判定
const isWeekendOrHoliday = (date: Date) => {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isHoliday = holidays.some(h => 
    h.getFullYear() === date.getFullYear() &&
    h.getMonth() === date.getMonth() &&
    h.getDate() === date.getDate()
  );
  return isWeekend || isHoliday;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

// モック通知データ
const mockNotifications = [
  { id: '1', title: '1/4 新春大会の当番が割り当てられました', type: 'duty', isRead: false, date: '2025-12-26' },
  { id: '2', title: '1/11 練習の配車が確定しました', type: 'vehicle', isRead: false, date: '2025-12-25' },
  { id: '3', title: '12/28 練習試合の出欠を入力してください', type: 'attendance', isRead: false, date: '2025-12-24' },
];

// モック: 現在のメンバー設定
const defaultMemberSettings = {
  available_saturday: true,
  available_sunday: true,
  available_holiday: false,
  start_time: '08:00',
  end_time: '17:00',
  can_drive: true,
  car_capacity: 3,
  can_load_equipment: true,
  car_model: 'プリウス',
  capable_duties: ['cat-1', 'cat-6'], // グラウンド整備, 雑務・お手伝い
};

export default function DashboardPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // メンバー設定
  const [availability, setAvailability] = useState({
    available_saturday: defaultMemberSettings.available_saturday,
    available_sunday: defaultMemberSettings.available_sunday,
    available_holiday: defaultMemberSettings.available_holiday,
    start_time: defaultMemberSettings.start_time,
    end_time: defaultMemberSettings.end_time,
  });
  const [carSettings, setCarSettings] = useState({
    can_drive: defaultMemberSettings.can_drive,
    car_capacity: defaultMemberSettings.car_capacity,
    can_load_equipment: defaultMemberSettings.can_load_equipment,
    car_model: defaultMemberSettings.car_model,
    area: '',
  });
  const [capableDuties, setCapableDuties] = useState<string[]>(defaultMemberSettings.capable_duties);
  const [memo, setMemo] = useState('');
  
  const handleDutyToggle = (categoryId: string) => {
    setCapableDuties(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  // カレンダーの日付を生成
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // 特定の日のイベントを取得
  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  // 選択された日のイベント
  const selectedDateEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  // 今日の日付
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // 今日以降のイベントを取得（当日含む）し、直近3件を表示
  const upcomingEvents = events
    .filter(event => event.date >= today)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 3);

  return (
    <PageContainer
      title="ダッシュボード"
      description="あなたの当番と予定を確認できます"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* 通知アコーディオン */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md overflow-hidden">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Bell className="h-4 w-4 text-accent" />
                </div>
                <span className="font-medium">通知一覧</span>
                {unreadCount > 0 && (
                  <Badge className="bg-accent text-white border-0 px-2 py-0.5 text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isNotificationOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2">
                    {mockNotifications.map((notification) => (
                      <Link key={notification.id} href="/notifications">
                        <div className={`p-3 rounded-lg flex items-start gap-3 transition-colors ${
                          notification.isRead ? 'bg-secondary/30' : 'bg-accent/5 hover:bg-accent/10'
                        }`}>
                          <div className={`mt-0.5 p-1 rounded-full ${
                            notification.isRead ? 'bg-muted' : 'bg-accent/20'
                          }`}>
                            {notification.type === 'duty' && <ClipboardCheck className={`h-3 w-3 ${notification.isRead ? 'text-muted-foreground' : 'text-accent'}`} />}
                            {notification.type === 'vehicle' && <Car className={`h-3 w-3 ${notification.isRead ? 'text-muted-foreground' : 'text-accent'}`} />}
                            {notification.type === 'attendance' && <Check className={`h-3 w-3 ${notification.isRead ? 'text-muted-foreground' : 'text-accent'}`} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm ${notification.isRead ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{notification.date}</p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 rounded-full bg-accent mt-1.5" />
                          )}
                        </div>
                      </Link>
                    ))}
                    <Link href="/notifications">
                      <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground">
                        すべての通知を見る
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* ミニカレンダー（直近の当番の代わり） */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-0 shadow-md h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg">スケジュール</CardTitle>
                  <CardDescription>予定と当番を確認</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[80px] text-center">
                    {format(currentMonth, 'yyyy年M月', { locale: ja })}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* 曜日ヘッダー */}
                <div className="grid grid-cols-7 mb-1">
                  {WEEKDAYS.map((day, index) => (
                    <div 
                      key={day} 
                      className={`text-center text-xs font-medium py-1 ${
                        index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-muted-foreground'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* カレンダーグリッド */}
                <div className="grid grid-cols-7 gap-0.5">
                  {calendarDays.map((day) => {
                    const dayEvents = getEventsForDay(day);
                    const hasEvent = dayEvents.length > 0;
                    const hasDuty = dayEvents.some(e => e.hasDuty);
                    const hasVehicle = dayEvents.some(e => e.hasVehicle);
                    const hasHelp = hasDuty || hasVehicle; // 当番or配車 = お手伝い
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const dayOfWeek = day.getDay();
                    
                    // イベントタイプのラベル
                    const eventLabels: Record<EventType, string> = {
                      practice: '練習',
                      game: '試合',
                      tournament: '大会',
                      event: 'その他',
                    };

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(isCurrentMonth ? day : null)}
                        className={`
                          relative aspect-square p-1 rounded-md transition-all text-center flex flex-col items-center justify-center
                          ${!isCurrentMonth ? 'opacity-30 cursor-default' : 'cursor-pointer hover:bg-secondary/50'}
                          ${isSelected ? 'bg-primary text-primary-foreground hover:bg-primary' : ''}
                          ${isToday(day) && !isSelected && !hasHelp ? 'ring-1 ring-primary' : ''}
                          ${hasHelp && !isSelected ? 'ring-2 ring-red-500 bg-red-50' : ''}
                        `}
                      >
                        <span className={`
                          text-sm font-medium
                          ${hasHelp && !isSelected ? 'text-red-600 font-bold' : ''}
                          ${dayOfWeek === 0 && !isSelected && !hasHelp ? 'text-red-500' : ''}
                          ${dayOfWeek === 6 && !isSelected && !hasHelp ? 'text-blue-500' : ''}
                        `}>
                          {format(day, 'd')}
                        </span>
                        
                        {/* イベントラベル（テキスト表示） */}
                        {hasEvent && isCurrentMonth && (
                          <span className={`
                            text-[10px] font-medium
                            ${isSelected 
                              ? 'text-primary-foreground/90' 
                              : dayEvents[0].type === 'practice' ? 'text-primary'
                              : dayEvents[0].type === 'game' ? 'text-green-600'
                              : dayEvents[0].type === 'tournament' ? 'text-amber-600'
                              : 'text-cyan-600'
                            }
                          `}>
                            {eventLabels[dayEvents[0].type]}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 凡例 */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-3 pt-3 border-t text-xs text-muted-foreground">
                  <span className="text-primary font-medium">練習</span>
                  <span className="text-green-600 font-medium">試合</span>
                  <span className="text-amber-600 font-medium">大会</span>
                  <span className="text-cyan-600 font-medium">イベント</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded ring-2 ring-red-500 bg-red-50" />
                    <span className="text-red-600 font-medium">お手伝い</span>
                  </div>
                </div>

              </CardContent>
            </Card>
          </motion.div>

          {/* 選択した日の詳細 or 次の予定 */}
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-md h-full">
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
                      const style = eventTypeStyles[event.type];
                      return (
                      <div key={event.id} className={`p-4 rounded-xl transition-all border-l-4 ${style.bg} ${style.border}`}>
                        <Link href={`/events/${event.id}`}>
                          <div className="hover:opacity-80 transition-opacity">
                            <p className="font-semibold mb-2">{event.title}</p>
                            
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* お手伝いがある場合のみ表示 */}
                        {(event.hasDuty || event.hasVehicle) && (
                          <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {event.hasDuty && (
                                <Badge className="bg-red-100 text-red-600 border-0">
                                  <ClipboardCheck className="h-3 w-3 mr-1" />
                                  {event.dutyName}
                                  <span className="ml-1 opacity-75">{event.time}〜</span>
                                </Badge>
                              )}
                              {event.hasVehicle && (
                                <Badge className="bg-blue-100 text-blue-600 border-0">
                                  <Car className="h-3 w-3 mr-1" />
                                  配車
                                  <span className="ml-1 opacity-75">{event.time}〜</span>
                                </Badge>
                              )}
                            </div>
                            
                            {/* アクションボタン */}
                            <div className="flex flex-wrap gap-2">
                              {event.hasDuty && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                      <ClipboardCheck className="h-3 w-3 mr-1" />
                                      当番OK？
                                      <ChevronDown className="h-3 w-3 ml-1" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => alert('当番を承認しました')}>
                                      <Check className="h-4 w-4 mr-2 text-green-600" />
                                      承認する
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => alert('当番の交代リクエスト機能は準備中です')}>
                                      <RefreshCw className="h-4 w-4 mr-2 text-red-600" />
                                      交代依頼
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                              {event.hasVehicle && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                                    >
                                      <Car className="h-3 w-3 mr-1" />
                                      配車OK？
                                      <ChevronDown className="h-3 w-3 ml-1" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => alert('配車を承認しました')}>
                                      <Check className="h-4 w-4 mr-2 text-green-600" />
                                      承認する
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => alert('配車の変更依頼機能は準備中です')}>
                                      <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                                      変更依頼
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                ) : selectedDate ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>この日は予定がありません</p>
                  </div>
                ) : (
                  /* デフォルト: 次の予定を表示 */
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => {
                      const style = eventTypeStyles[event.type];
                      return (
                      <div key={event.id} className={`p-4 rounded-xl transition-all border-l-4 ${style.bg} ${style.border}`}>
                        <Link href={`/events/${event.id}`}>
                          <div className="hover:opacity-80 transition-opacity">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-1">
                              <span>{format(event.date, 'M/d(E)', { locale: ja })}</span>
                              {isToday(event.date) && (
                                <Badge className="bg-primary text-white text-[10px] px-1.5 py-0">本日</Badge>
                              )}
                              {isTomorrow(event.date) && (
                                <Badge className="bg-accent text-white text-[10px] px-1.5 py-0">明日</Badge>
                              )}
                            </div>
                            <p className="font-semibold mb-2">{event.title}</p>
                            
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </Link>

                        {/* お手伝いがある場合のみ表示 */}
                        {(event.hasDuty || event.hasVehicle) && (
                          <div className="mt-3 pt-3 border-t border-border/50 space-y-3">
                            <div className="flex flex-wrap gap-2">
                              {event.hasDuty && (
                                <Badge className="bg-red-100 text-red-600 border-0">
                                  <ClipboardCheck className="h-3 w-3 mr-1" />
                                  {event.dutyName}
                                  <span className="ml-1 opacity-75">{event.time}〜</span>
                                </Badge>
                              )}
                              {event.hasVehicle && (
                                <Badge className="bg-blue-100 text-blue-600 border-0">
                                  <Car className="h-3 w-3 mr-1" />
                                  配車
                                  <span className="ml-1 opacity-75">{event.time}〜</span>
                                </Badge>
                              )}
                            </div>
                            
                            {/* アクションボタン */}
                            <div className="flex flex-wrap gap-2">
                              {event.hasDuty && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                      <ClipboardCheck className="h-3 w-3 mr-1" />
                                      当番OK？
                                      <ChevronDown className="h-3 w-3 ml-1" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => alert('当番を承認しました')}>
                                      <Check className="h-4 w-4 mr-2 text-green-600" />
                                      承認する
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => alert('当番の交代リクエスト機能は準備中です')}>
                                      <RefreshCw className="h-4 w-4 mr-2 text-red-600" />
                                      交代依頼
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                              {event.hasVehicle && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50"
                                    >
                                      <Car className="h-3 w-3 mr-1" />
                                      配車OK？
                                      <ChevronDown className="h-3 w-3 ml-1" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => alert('配車を承認しました')}>
                                      <Check className="h-4 w-4 mr-2 text-green-600" />
                                      承認する
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => alert('配車の変更依頼機能は準備中です')}>
                                      <MessageCircle className="h-4 w-4 mr-2 text-blue-600" />
                                      変更依頼
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* お手伝いデフォルト設定（アコーディオン） */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md overflow-hidden">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                <div className="text-left">
                  <span className="font-medium">お手伝いデフォルト設定</span>
                  <p className="text-xs text-muted-foreground">対応可能な曜日・時間・当番を設定</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isSettingsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-6">
                    {/* 可能な曜日 */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        可能な曜日
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={availability.available_saturday}
                            onCheckedChange={(checked) => 
                              setAvailability(prev => ({ ...prev, available_saturday: checked as boolean }))
                            }
                          />
                          <span className="text-sm">土曜日</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={availability.available_sunday}
                            onCheckedChange={(checked) => 
                              setAvailability(prev => ({ ...prev, available_sunday: checked as boolean }))
                            }
                          />
                          <span className="text-sm">日曜日</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={availability.available_holiday}
                            onCheckedChange={(checked) => 
                              setAvailability(prev => ({ ...prev, available_holiday: checked as boolean }))
                            }
                          />
                          <span className="text-sm">祝日</span>
                        </label>
                      </div>
                    </div>

                    {/* 可能な時間帯 */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        可能な時間帯
                      </p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="time"
                          value={availability.start_time}
                          onChange={(e) => setAvailability(prev => ({ ...prev, start_time: e.target.value }))}
                          className="w-28"
                        />
                        <span className="text-muted-foreground">〜</span>
                        <Input
                          type="time"
                          value={availability.end_time}
                          onChange={(e) => setAvailability(prev => ({ ...prev, end_time: e.target.value }))}
                          className="w-28"
                        />
                      </div>
                    </div>

                    {/* 対応可能な当番 */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <ClipboardCheck className="h-4 w-4 text-primary" />
                        対応可能なお手伝い
                      </p>
                      <div className="space-y-4">
                        {mockDutyCategoryGroups.map((group) => (
                          <div key={group.id}>
                            <p className="text-xs text-muted-foreground mb-2">{group.icon} {group.name}</p>
                            <div className="flex flex-wrap gap-2">
                              {mockDutyCategories
                                .filter(cat => cat.group_id === group.id)
                                .map((category) => (
                                  <Badge
                                    key={category.id}
                                    variant={capableDuties.includes(category.id) ? 'default' : 'outline'}
                                    className="cursor-pointer transition-all"
                                    onClick={() => handleDutyToggle(category.id)}
                                  >
                                    {capableDuties.includes(category.id) && <Check className="h-3 w-3 mr-1" />}
                                    {category.name}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 配車設定 */}
                    <div className="space-y-3">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Car className="h-4 w-4 text-primary" />
                        配車設定
                      </p>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={carSettings.can_drive}
                          onCheckedChange={(checked) => 
                            setCarSettings(prev => ({ ...prev, can_drive: checked as boolean }))
                          }
                        />
                        <span className="text-sm">運転可能</span>
                      </label>
                      
                      {carSettings.can_drive && (
                        <div className="pl-6 space-y-3 border-l-2 border-primary/20">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">乗車可能人数:</span>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={carSettings.car_capacity}
                              onChange={(e) => setCarSettings(prev => ({ 
                                ...prev, 
                                car_capacity: parseInt(e.target.value) || 0 
                              }))}
                              className="w-16 h-8"
                            />
                            <span className="text-sm text-muted-foreground">名</span>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Checkbox
                              checked={carSettings.can_load_equipment}
                              onCheckedChange={(checked) => 
                                setCarSettings(prev => ({ ...prev, can_load_equipment: checked as boolean }))
                              }
                            />
                            <Package className="h-4 w-4" />
                            <span className="text-sm">道具の積み込みOK</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">車種:</span>
                            <Input
                              value={carSettings.car_model}
                              onChange={(e) => setCarSettings(prev => ({ ...prev, car_model: e.target.value }))}
                              placeholder="例: プリウス"
                              className="flex-1 h-8"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">地域:</span>
                            <Input
                              value={carSettings.area}
                              onChange={(e) => setCarSettings(prev => ({ ...prev, area: e.target.value }))}
                              placeholder="例: 〇〇町、△△駅周辺"
                              className="flex-1 h-8"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 備考 */}
                    <div className="space-y-3 pt-3 border-t border-border/50">
                      <p className="text-sm font-medium flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        備考
                      </p>
                      <textarea
                        placeholder="例: チャイルドシートあり、土曜午前は難しいことが多い など"
                        className="w-full min-h-[80px] p-3 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                      />
                    </div>

                    <Button className="w-full" onClick={() => {
                      // TODO: 保存処理
                      setIsSettingsOpen(false);
                    }}>
                      設定を保存
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </motion.div>
    </PageContainer>
  );
}
