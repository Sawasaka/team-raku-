'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  Car, 
  Bell,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Sparkles,
  Clock,
  MapPin,
  Check,
  Settings,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingBaseball } from '@/components/features/Baseball3D';

// 特徴データ
const features = [
  {
    icon: Calendar,
    title: '予定管理',
    description: 'いつ・どこで・何があるか一目で',
    color: 'indigo',
    bgFrom: 'from-white',
    bgTo: 'to-indigo-50/80',
    iconBg: 'bg-indigo-500',
    iconShadow: 'shadow-indigo-500/30',
    numColor: 'text-indigo-500',
    bgNum: 'text-indigo-100/50',
    border: 'border-indigo-100/80',
    hoverShadow: 'hover:shadow-indigo-200/40',
  },
  {
    icon: ClipboardCheck,
    title: '当番管理',
    description: '「誰がやる？」がすぐ決まる',
    color: 'emerald',
    bgFrom: 'from-white',
    bgTo: 'to-emerald-50/80',
    iconBg: 'bg-emerald-500',
    iconShadow: 'shadow-emerald-500/30',
    numColor: 'text-emerald-500',
    bgNum: 'text-emerald-100/50',
    border: 'border-emerald-100/80',
    hoverShadow: 'hover:shadow-emerald-200/40',
  },
  {
    icon: Car,
    title: '配車管理',
    description: '送迎調整の手間をゼロに',
    color: 'orange',
    bgFrom: 'from-white',
    bgTo: 'to-orange-50/80',
    iconBg: 'bg-orange-500',
    iconShadow: 'shadow-orange-500/30',
    numColor: 'text-orange-500',
    bgNum: 'text-orange-100/50',
    border: 'border-orange-100/80',
    hoverShadow: 'hover:shadow-orange-200/40',
  },
  {
    icon: Users,
    title: 'メンバー管理',
    description: '連絡先も設定もまとめて管理',
    color: 'violet',
    bgFrom: 'from-white',
    bgTo: 'to-violet-50/80',
    iconBg: 'bg-violet-500',
    iconShadow: 'shadow-violet-500/30',
    numColor: 'text-violet-500',
    bgNum: 'text-violet-100/50',
    border: 'border-violet-100/80',
    hoverShadow: 'hover:shadow-violet-200/40',
  },
  {
    icon: Bell,
    title: '通知機能',
    description: '大事な連絡を見逃さない',
    color: 'rose',
    bgFrom: 'from-white',
    bgTo: 'to-rose-50/80',
    iconBg: 'bg-rose-500',
    iconShadow: 'shadow-rose-500/30',
    numColor: 'text-rose-500',
    bgNum: 'text-rose-100/50',
    border: 'border-rose-100/80',
    hoverShadow: 'hover:shadow-rose-200/40',
  },
];

const benefits = [
  '無料で始められる',
  'かんたん設定ですぐ使える',
  'シンプルで使いやすいデザイン',
];

// イベントデータ（シンプルに）
const previewEvents = [
  { day: 17, title: '練習', type: 'practice', time: '09:00', location: '〇〇グラウンド', duty: 'グラウンド整備', vehicle: false },
  { day: 18, title: '練習試合', type: 'game', time: '10:00', location: '□□スタジアム', duty: null, vehicle: true },
];

// ダッシュボードプレビューコンポーネント
function DashboardPreview() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isNotificationExpanded, setIsNotificationExpanded] = useState(false);

  const selectedEvent = selectedDay ? previewEvents.find(e => e.day === selectedDay) : null;

  // 次の予定（選択がない場合）- 1件だけ表示
  const upcomingEvents = previewEvents.filter(e => e.day >= 16).slice(0, 1);

  // ユーザー操作
  const handleUserInteraction = (action: () => void) => {
    action();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mt-16 sm:mt-24"
    >
      <div className="relative mx-auto max-w-5xl">
        <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-orange-500/20 blur-3xl" />
        <div className="relative rounded-3xl border border-border/50 bg-card/95 backdrop-blur-sm p-4 sm:p-6 shadow-2xl">
          {/* ブラウザ風ヘッダー */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border/50">
            <div className="flex gap-1.5">
              <motion.div whileHover={{ scale: 1.2 }} className="h-3 w-3 rounded-full bg-red-400 cursor-pointer" />
              <motion.div whileHover={{ scale: 1.2 }} className="h-3 w-3 rounded-full bg-yellow-400 cursor-pointer" />
              <motion.div whileHover={{ scale: 1.2 }} className="h-3 w-3 rounded-full bg-green-400 cursor-pointer" />
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-secondary/80 rounded-full px-4 py-1.5 text-xs text-muted-foreground flex items-center gap-2">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                team-raku.app/dashboard
              </div>
            </div>
          </div>

          {/* ダッシュボード本体 */}
          <div className="space-y-3">
            {/* 通知バー - クリック可能 */}
            <motion.button
              onClick={() => handleUserInteraction(() => setIsNotificationExpanded(!isNotificationExpanded))}
              className="w-full rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/50 p-3 flex items-center justify-between hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-orange-100">
                  <Bell className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-orange-800">新しい通知が3件あります</span>
              </div>
              <motion.div animate={{ rotate: isNotificationExpanded ? 90 : 0 }}>
                <ChevronRight className="h-4 w-4 text-orange-400" />
              </motion.div>
            </motion.button>

            {/* 通知展開 */}
            <AnimatePresence>
              {isNotificationExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pb-2">
                    {[
                      { text: '1/4 新春大会の当番が割り当てられました', icon: ClipboardCheck },
                      { text: '1/18 練習試合の配車が確定しました', icon: Car },
                      { text: '1/25 新人戦の出欠を入力してください', icon: Calendar },
                    ].map((notif, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 p-2 bg-white rounded-lg border border-orange-100"
                      >
                        <notif.icon className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-muted-foreground">{notif.text}</span>
                        <div className="ml-auto w-2 h-2 rounded-full bg-orange-500" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* メインコンテンツ */}
            <div className="grid gap-4 lg:grid-cols-5">
              {/* カレンダー */}
              <div className="lg:col-span-3 rounded-xl bg-card border border-border/50 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold">2026年1月</span>
                  <div className="flex gap-1">
                    <motion.button 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }}
                      className="w-6 h-6 rounded-md bg-secondary/50 flex items-center justify-center hover:bg-secondary"
                    >
                      <ChevronLeft className="h-3 w-3" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }}
                      className="w-6 h-6 rounded-md bg-secondary/50 flex items-center justify-center hover:bg-secondary"
                    >
                      <ChevronRight className="h-3 w-3" />
                    </motion.button>
                  </div>
                </div>
                
                {/* 曜日ヘッダー */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['日', '月', '火', '水', '木', '金', '土'].map((day, i) => (
                    <div key={day} className={`text-center text-xs font-medium py-1 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-muted-foreground'}`}>
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* カレンダーグリッド */}
                <div className="grid grid-cols-7 gap-1">
                  {/* 先月の日付 */}
                  {[28, 29, 30, 31].map((d) => (
                    <div key={`prev-${d}`} className="aspect-square flex flex-col items-center justify-center text-xs text-muted-foreground/40">
                      {d}
                    </div>
                  ))}
                  {/* 今月の日付 */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                    const event = previewEvents.find(e => e.day === d);
                    const hasEvent = !!event;
                    const hasDuty = event?.duty;
                    const isSelected = selectedDay === d;
                    const isToday = d === 16;
                    
                    // 表示するイベントを2件に限定
                    const displayEvent = [17, 18].includes(d) ? event : null;
                    const displayHasDuty = d === 17 ? hasDuty : false;

                    return (
                      <motion.button
                        key={d}
                        onClick={() => handleUserInteraction(() => setSelectedDay(displayEvent ? (selectedDay === d ? null : d) : null))}
                        whileHover={displayEvent ? { scale: 1.15, zIndex: 10 } : {}}
                        whileTap={displayEvent ? { scale: 0.95 } : {}}
                        className={`aspect-square flex flex-col items-center justify-center text-xs rounded-md transition-all relative
                          ${isSelected ? 'ring-2 ring-indigo-500 bg-indigo-100 shadow-lg z-10' : ''}
                          ${isToday && !isSelected ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''}
                          ${displayHasDuty && !isSelected && !isToday ? 'ring-2 ring-red-500 bg-red-50' : ''}
                          ${displayEvent && !displayHasDuty && !isSelected && !isToday ? 'bg-indigo-50/50' : ''}
                          ${displayEvent ? 'cursor-pointer hover:shadow-md' : ''}
                          ${(d % 7 === 4) ? 'text-red-500' : (d % 7 === 3) ? 'text-blue-500' : ''}
                        `}
                        transition={{ duration: 0.3 }}
                      >
                        <span className={`font-medium ${displayHasDuty && !isSelected ? 'text-red-600 font-bold' : ''}`}>{d}</span>
                        {displayEvent && (
                          <span className={`text-[8px] font-medium mt-0.5 ${
                            isSelected ? 'text-indigo-700' :
                            displayEvent.type === 'practice' ? 'text-indigo-600' : 
                            displayEvent.type === 'game' ? 'text-green-600' : 'text-amber-600'
                          }`}>
                            {displayEvent.type === 'practice' ? '練習' : displayEvent.type === 'game' ? '試合' : '大会'}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
                
                {/* 凡例 */}
                <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border/50 text-[10px]">
                  <span className="text-indigo-600 font-medium">練習</span>
                  <span className="text-green-600 font-medium">試合</span>
                  <span className="text-amber-600 font-medium">大会</span>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded ring-1 ring-red-500 bg-red-50" />
                    <span className="text-red-600 font-medium">お手伝い</span>
                  </div>
                </div>

                {/* 操作ヒント */}
                <p className="text-center text-[10px] text-muted-foreground mt-3">
                  日付をクリックして予定を確認
                </p>
              </div>

              {/* 次の予定 / 選択した日の詳細 */}
              <div className="lg:col-span-2 rounded-xl bg-card border border-border/50 p-4 shadow-sm">
                <AnimatePresence mode="wait">
                  {selectedEvent ? (
                    <motion.div
                      key="selected"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-semibold">1/{selectedDay}の予定</span>
                          <p className="text-xs text-muted-foreground">詳細情報</p>
                        </div>
                        <motion.button
                          onClick={() => handleUserInteraction(() => setSelectedDay(null))}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          ✕ 閉じる
                        </motion.button>
                      </div>
                      
                      <motion.div 
                        className={`p-4 rounded-lg border-l-4 ${
                          selectedEvent.type === 'practice' ? 'bg-indigo-50 border-indigo-500' :
                          selectedEvent.type === 'game' ? 'bg-green-50 border-green-500' : 'bg-amber-50 border-amber-500'
                        }`}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                      >
                        <p className="font-semibold text-lg mb-2">{selectedEvent.title}</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{selectedEvent.time}〜</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{selectedEvent.location}</span>
                          </div>
                        </div>
                        
                        {(selectedEvent.duty || selectedEvent.vehicle) && (
                          <div className="mt-3 pt-3 border-t border-border/50 flex flex-wrap gap-2">
                            {selectedEvent.duty && (
                              <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full"
                              >
                                <ClipboardCheck className="h-3 w-3" />
                                {selectedEvent.duty}
                              </motion.span>
                            )}
                            {selectedEvent.vehicle && (
                              <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="inline-flex items-center gap-1 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
                              >
                                <Car className="h-3 w-3" />
                                配車あり
                              </motion.span>
                            )}
                          </div>
                        )}

                        {/* アクションボタン */}
                        <div className="mt-4 flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium rounded-lg"
                          >
                            詳細を見る
                          </motion.button>
                          {selectedEvent.duty && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 py-2 bg-red-500 text-white text-xs font-medium rounded-lg"
                            >
                              当番OK
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="upcoming"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="mb-3">
                        <span className="font-semibold">次の予定</span>
                        <p className="text-xs text-muted-foreground">直近のスケジュール</p>
                      </div>
                      
                      <div className="space-y-3">
                        {upcomingEvents.map((event, i) => (
                          <motion.button
                            key={event.day}
                            onClick={() => handleUserInteraction(() => setSelectedDay(event.day))}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className={`w-full text-left p-3 rounded-lg border-l-4 transition-shadow hover:shadow-md ${
                              event.type === 'practice' ? 'bg-indigo-50 border-indigo-500' :
                              event.type === 'game' ? 'bg-green-50 border-green-500' : 'bg-amber-50 border-amber-500'
                            }`}
                          >
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
                              <span className="font-medium">1/{event.day}</span>
                              {event.day === 17 && (
                                <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[9px]">明日</span>
                              )}
                            </div>
                            <p className="font-semibold text-sm mb-1">{event.title}</p>
                            <div className="text-[10px] text-muted-foreground space-y-0.5">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{event.time}〜</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            {(event.duty || event.vehicle) && (
                              <div className="mt-2 pt-2 border-t border-border/30 flex flex-wrap gap-1">
                                {event.duty && (
                                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full">
                                    <ClipboardCheck className="h-2.5 w-2.5" />
                                    {event.duty}
                                  </span>
                                )}
                                {event.vehicle && (
                                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full">
                                    <Car className="h-2.5 w-2.5" />
                                    配車あり
                                  </span>
                                )}
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// インタラクティブデモコンポーネント
function InteractiveDemo({ benefits }: { benefits: string[] }) {
  const [activeScreen, setActiveScreen] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const screens = [
    {
      id: 'calendar',
      title: 'カレンダーで予定を確認',
      icon: Calendar,
      color: 'indigo',
    },
    {
      id: 'duty',
      title: '当番をワンクリック割り当て',
      icon: ClipboardCheck,
      color: 'emerald',
    },
    {
      id: 'vehicle',
      title: '配車も簡単に管理',
      icon: Car,
      color: 'orange',
    },
    {
      id: 'settings',
      title: 'お手伝い設定',
      icon: Settings,
      color: 'purple',
    },
  ];

  // 自動再生
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % screens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, screens.length]);

  const handleScreenClick = (index: number) => {
    setActiveScreen(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-background via-secondary/20 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
              使いやすさ
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
              誰でも使える
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                シンプル設計
              </span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              かんたん設計だから安心。
              <br />
              大きなボタンとわかりやすい画面で、迷わず操作できます。
            </p>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-foreground font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-orange-500/20 blur-3xl" />
            <div className="relative rounded-3xl bg-card border border-border/50 p-6 shadow-2xl overflow-hidden">
              {/* ヘッダー */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div 
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 text-white text-xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  楽
                </motion.div>
                <div>
                  <div className="text-lg font-bold text-foreground">チーム楽</div>
                  <div className="text-xs text-muted-foreground">お当番管理アプリ</div>
                </div>
              </div>

              {/* ナビゲーションタブ */}
              <div className="flex gap-2 mb-4 p-1 bg-secondary/50 rounded-xl">
                {screens.map((screen, index) => (
                  <button
                    key={screen.id}
                    onClick={() => handleScreenClick(index)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                      activeScreen === index
                        ? 'bg-white shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <screen.icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{screen.id === 'calendar' ? '予定' : screen.id === 'duty' ? '当番' : screen.id === 'vehicle' ? '配車' : '設定'}</span>
                  </button>
                ))}
              </div>

              {/* スクリーンコンテンツ */}
              <div className="relative h-[320px] overflow-hidden rounded-xl bg-secondary/30">
                <AnimatePresence mode="wait">
                  {activeScreen === 0 && (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-4"
                    >
                      {/* カレンダー画面 */}
                      <div className="text-sm font-semibold mb-3">2026年1月</div>
                      <div className="grid grid-cols-7 gap-1 text-[10px] mb-2">
                        {['日', '月', '火', '水', '木', '金', '土'].map((d, i) => (
                          <div key={d} className={`text-center py-1 ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-muted-foreground'}`}>{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: 35 }, (_, i) => {
                          const day = i - 3;
                          const isValid = day > 0 && day <= 31;
                          const hasEvent = isValid && [3, 4, 10, 17, 18, 25].includes(day);
                          const hasDuty = isValid && [4, 17, 25].includes(day);
                          return (
                            <motion.div
                              key={i}
                              className={`aspect-square flex items-center justify-center text-[10px] rounded ${
                                !isValid ? 'text-muted-foreground/30' :
                                hasDuty ? 'bg-red-100 text-red-600 font-bold ring-1 ring-red-400' :
                                hasEvent ? 'bg-indigo-50 text-indigo-600' : ''
                              }`}
                              whileHover={isValid ? { scale: 1.2 } : {}}
                            >
                              {isValid ? day : day <= 0 ? 28 + day : day - 31}
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="mt-3 p-2 bg-indigo-50 rounded-lg border-l-2 border-indigo-500">
                        <p className="text-[10px] text-indigo-600 font-medium">1/17 練習 09:00〜</p>
                        <p className="text-[9px] text-muted-foreground">〇〇グラウンド</p>
                      </div>
                    </motion.div>
                  )}

                  {activeScreen === 1 && (
                    <motion.div
                      key="duty"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-4"
                    >
                      {/* 当番画面 */}
                      <div className="text-sm font-semibold mb-3">1/17(土) 練習の当番</div>
                      <div className="space-y-2">
                        {[
                          { name: 'グラウンド整備', person: '山田さん', confirmed: true },
                          { name: 'お茶当番', person: '鈴木さん', confirmed: true },
                          { name: '記録係', person: '未割当', confirmed: false },
                        ].map((duty, i) => (
                          <motion.div
                            key={duty.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-3 rounded-lg border ${duty.confirmed ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs font-medium">{duty.name}</p>
                                <p className={`text-[10px] ${duty.confirmed ? 'text-emerald-600' : 'text-amber-600'}`}>{duty.person}</p>
                              </div>
                              {duty.confirmed ? (
                                <div className="h-6 w-6 rounded-full bg-emerald-500 flex items-center justify-center">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="px-2 py-1 bg-amber-500 text-white text-[10px] rounded-md"
                                >
                                  割り当て
                                </motion.button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-medium rounded-lg"
                      >
                        当番を自動割り当て
                      </motion.button>
                    </motion.div>
                  )}

                  {activeScreen === 2 && (
                    <motion.div
                      key="vehicle"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-4"
                    >
                      {/* 配車画面 */}
                      <div className="text-sm font-semibold mb-3">1/18(日) 練習試合の配車</div>
                      <div className="space-y-2">
                        {[
                          { driver: '田中さん', car: 'プリウス', seats: 3, passengers: ['選手A', '選手B', '選手C'] },
                          { driver: '佐藤さん', car: 'アルファード', seats: 5, passengers: ['選手D', '選手E'] },
                        ].map((vehicle, i) => (
                          <motion.div
                            key={vehicle.driver}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-3 rounded-lg bg-orange-50 border border-orange-200"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <Car className="h-4 w-4 text-orange-600" />
                              <span className="text-xs font-medium">{vehicle.driver}</span>
                              <span className="text-[10px] text-muted-foreground">({vehicle.car})</span>
                            </div>
                            <div className="flex items-center gap-1 flex-wrap">
                              {vehicle.passengers.map((p) => (
                                <span key={p} className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[9px] rounded">{p}</span>
                              ))}
                              {vehicle.passengers.length < vehicle.seats && (
                                <span className="px-1.5 py-0.5 border border-dashed border-orange-300 text-orange-400 text-[9px] rounded">空き{vehicle.seats - vehicle.passengers.length}席</span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg text-center">
                        <p className="text-[10px] text-blue-600">集合: 09:30 〇〇駅前</p>
                        <p className="text-[10px] text-blue-600">目的地: □□スタジアム</p>
                      </div>
                    </motion.div>
                  )}

                  {activeScreen === 3 && (
                    <motion.div
                      key="settings"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 p-4 overflow-y-auto"
                    >
                      {/* 設定画面 */}
                      <div className="text-sm font-semibold mb-3">お手伝いデフォルト設定</div>
                      <div className="space-y-2">
                        <motion.div 
                          className="p-2.5 bg-white rounded-lg border border-indigo-100"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">可能な曜日</span>
                            <div className="flex gap-1">
                              {['土', '日'].map((d) => (
                                <span key={d} className="px-1.5 py-0.5 bg-indigo-500 text-white text-[9px] rounded font-medium">{d}</span>
                              ))}
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[9px] rounded">祝</span>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="p-2.5 bg-white rounded-lg border border-blue-100"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">可能な時間</span>
                            <span className="text-[10px] font-medium">08:00 〜 17:00</span>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="p-2.5 bg-white rounded-lg border border-emerald-100"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-muted-foreground">対応可能な当番</span>
                            <div className="flex gap-1 flex-wrap">
                              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] rounded font-medium flex items-center gap-0.5">
                                <Check className="h-2 w-2" />グラウンド整備
                              </span>
                              <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] rounded font-medium flex items-center gap-0.5">
                                <Check className="h-2 w-2" />お茶当番
                              </span>
                              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-[9px] rounded">記録係</span>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="p-2.5 bg-white rounded-lg border border-orange-100"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-muted-foreground">配車設定</span>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <Car className="h-3 w-3 text-orange-500" />
                                <span className="text-[10px] font-medium">運転可能</span>
                              </div>
                              <span className="text-[10px] text-muted-foreground">3名乗車OK</span>
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-muted-foreground">
                              <span>車種: プリウス</span>
                              <span>道具積載: ○</span>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="p-2.5 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-100"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25 }}
                        >
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-red-600 font-medium">📋 直近の当番予定</span>
                            <div className="text-[10px]">
                              <div className="flex justify-between">
                                <span>1/17(土) 練習</span>
                                <span className="text-red-600 font-medium">グラウンド整備</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        <motion.div 
                          className="p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-blue-600 font-medium">🚗 直近の配車予定</span>
                            <div className="text-[10px]">
                              <div className="flex justify-between">
                                <span>1/18(日) 練習試合</span>
                                <span className="text-blue-600 font-medium">選手3名送迎</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-2 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-medium rounded-lg shadow-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                      >
                        設定を保存
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 進行インジケーター */}
              <div className="flex justify-center gap-2 mt-4">
                {screens.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleScreenClick(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeScreen === index ? 'w-6 bg-indigo-500' : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* 操作ヒント */}
              <p className="text-center text-[10px] text-muted-foreground mt-2">
                クリックで画面を切り替え
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* ヒーローセクション */}
        <section className="relative overflow-hidden gradient-hero">
          {/* 背景装飾 - 静的に変更してパフォーマンス改善 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-300/50 to-purple-300/30 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-orange-200/40 to-pink-200/20 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100/20 to-indigo-100/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
            <div className="text-center">
              {/* バッジ */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 px-4 py-2 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-500/20 mb-8 shadow-lg"
              >
                  <Sparkles className="h-4 w-4" />
                チーム楽 - お当番管理アプリ
              </motion.div>

              {/* メインタイトル */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl"
              >
                お当番管理を
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient">
                  もっと楽に。
                </span>
              </motion.h1>

              {/* サブタイトル */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
              >
                予定管理、当番割り当て、配車手配をひとつのアプリで。
                <br className="hidden sm:block" />
                チーム運営の悩みをスッキリ解決します。
              </motion.p>

              {/* CTA ボタン */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-base px-8 py-6"
                >
                  <Link href="/register">
                    無料で始める
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group border-2 hover:bg-secondary/50 transition-all duration-300 hover:scale-105 text-base px-8 py-6"
                >
                  <Link href="/login">
                    ログイン
                  </Link>
                </Button>
              </motion.div>

              {/* 信頼性指標 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
              >
                {['3ヶ月無料', 'かんたん設定', '直感的に使える'].map((text, i) => (
                  <motion.div 
                    key={text} 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span>{text}</span>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>
        </section>

        {/* サービス紹介動画セクション */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-background via-secondary/20 to-background relative overflow-hidden">
          {/* 背景装飾 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-20 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-20 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 text-red-600 text-sm font-semibold mb-4 ring-1 ring-red-500/20"
                whileHover={{ scale: 1.05 }}
              >
                <Play className="h-4 w-4" />
                サービス紹介動画
              </motion.span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  動画でわかる
                </span>
                チーム楽
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                チーム楽の特徴をサクッとご紹介します
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              {/* 動画コンテナの装飾 */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl" />
              
              {/* 動画埋め込み */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-black aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/3eTOctnUuwY?rel=0&modestbranding=1"
                  title="チーム楽 サービス紹介動画"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>

              {/* 動画下のアクション */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/register">
                    無料で始める
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  3ヶ月間無料でお試しいただけます
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* インタラクティブデモセクション */}
        <InteractiveDemo benefits={benefits} />

        {/* 特徴セクション */}
        <section className="py-20 sm:py-32 bg-gradient-to-b from-background via-indigo-50/30 to-background relative overflow-hidden">
          {/* 背景装飾 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/30 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl" />
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <motion.span 
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 text-sm font-semibold mb-6 ring-1 ring-indigo-500/20"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-4 w-4" />
                できること
              </motion.span>
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600">
                  これひとつで
                </span>
                <br />
                チーム運営が変わる
              </h2>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                面倒だった当番調整も、複雑な配車手配も。
                <br className="hidden sm:block" />
                すべてがシンプルになります。
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="group"
                >
                  <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${feature.bgFrom} ${feature.bgTo} border ${feature.border} shadow-sm hover:shadow-xl ${feature.hoverShadow} hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden`}>
                    {/* 背景の番号（装飾） */}
                    <span className={`absolute -top-2 -right-2 text-8xl font-black ${feature.bgNum} select-none pointer-events-none`}>
                      {index + 1}
                    </span>
                    
                    {/* コンテンツ */}
                    <div className="relative z-10">
                      {/* 番号 + アイコン */}
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`text-2xl font-bold ${feature.numColor}`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className={`h-10 w-10 rounded-xl ${feature.iconBg} flex items-center justify-center shadow-lg ${feature.iconShadow} group-hover:scale-110 transition-transform`}>
                          <feature.icon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      
                      {/* タイトル */}
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      
                      {/* 説明 */}
                      <p className="text-base text-foreground/70 leading-relaxed font-medium">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 料金セクション */}
        <section className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-transparent via-indigo-50/30 to-transparent">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {/* セクションヘッダー */}
              <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">シンプルな料金プラン</span>
                </h2>
              <p className="text-muted-foreground text-lg">
                チーム規模に関わらず、同じ価格でご利用いただけます
              </p>
              </motion.div>

              <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* 料金カード */}
              <div className="relative rounded-3xl bg-gradient-to-br from-white to-indigo-50/80 border border-indigo-100 p-8 sm:p-10 shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                {/* 背景装飾 */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                    {/* 左側: 価格情報 */}
                    <div>
                      {/* 3ヶ月無料バッジ */}
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
                        <span>🎉</span>
                        <span>3ヶ月無料</span>
                      </div>
                      
                      {/* 価格表示 */}
                      <div className="flex items-baseline gap-3 mb-3">
                        <span className="text-muted-foreground text-xl line-through">¥15,800</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">¥9,800</span>
                        <span className="text-muted-foreground text-lg">/月</span>
                      </div>
                      
                      {/* 利用人数 */}
                      <div className="flex items-center gap-2 text-foreground/80">
                        <Users className="h-5 w-5 text-indigo-500" />
                        <span className="font-medium">利用人数無制限</span>
                      </div>
                    </div>

                    {/* 右側: 特典リスト */}
                    <div className="lg:min-w-[300px]">
                      <div className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                        <span>✨</span>
                        <span>すべての機能が使える</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          'お当番管理・自動割り当て',
                          '配車管理・車両登録',
                          'チームメンバー管理',
                          '出欠確認・通知機能',
                        ].map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
                              <Check className="h-3 w-3 text-emerald-600" />
                  </div>
                            <span className="text-foreground/80 text-sm">{feature}</span>
                    </div>
                        ))}
                    </div>
                    </div>
                  </div>
                  
                  {/* CTAボタン */}
                  <div className="mt-8 pt-8 border-t border-indigo-100">
                    <Button
                      asChild
                      size="lg"
                      className="w-full sm:w-auto group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 text-base px-10 py-6 rounded-xl"
                    >
                      <Link href="/register">
                        無料で始める
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-20 sm:py-32 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 relative">
          <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
                無料で始められます
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl mb-6">
                今すぐ始めよう
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                チーム運営をもっと楽に、もっとスマートに。
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                  asChild
                size="lg"
                  className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-base px-10 py-6"
              >
                <Link href="/register">
                    無料で登録する
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-base px-10 py-6"
                >
                  <Link href="/login">
                    ログイン
                </Link>
              </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingBaseball />
    </div>
  );
}
