'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Car, 
  Bus, 
  Search, 
  Calendar,
  MapPin,
  Clock,
  Users,
  Filter,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageContainer } from '@/components/layout/PageContainer';
import { EVENT_TYPE_LABELS } from '@/lib/constants';
import { getEventVehicleSummaries, mockEvents } from '@/lib/mock-data';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminVehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // イベント別の配車サマリーを取得
  const eventSummaries = getEventVehicleSummaries();

  // 配車未設定のイベント
  const eventsWithoutVehicles = mockEvents.filter(
    event => !eventSummaries.some(summary => summary.event.id === event.id)
  );

  const filteredSummaries = eventSummaries.filter((summary) => {
    const matchesSearch = summary.event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || summary.event.event_type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredEventsWithoutVehicles = eventsWithoutVehicles.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || event.event_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <PageContainer
      title="配車管理"
      description="イベントごとの配車（車両・バス）を管理します"
    >
      {/* フィルター */}
      <Card className="border-0 shadow-md mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="イベント名や場所で検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="種類" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="practice">練習</SelectItem>
                <SelectItem value="game">試合</SelectItem>
                <SelectItem value="other">その他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 配車未設定のイベント（警告） */}
      {filteredEventsWithoutVehicles.length > 0 && (
        <Card className="border-0 shadow-md mb-6 border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              配車未設定のイベント
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredEventsWithoutVehicles.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center justify-between p-3 bg-amber-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className={
                        event.event_type === 'practice'
                          ? 'bg-primary/10 text-primary'
                          : event.event_type === 'game'
                          ? 'bg-accent/10 text-accent'
                          : 'bg-muted text-muted-foreground'
                      }
                    >
                      {EVENT_TYPE_LABELS[event.event_type]}
                    </Badge>
                    <span className="font-medium">{event.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(event.event_date), 'M月d日(E)', { locale: ja })}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/events/${event.id}/vehicles`}>
                      配車設定
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 配車設定済みイベント一覧 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredSummaries.length === 0 && filteredEventsWithoutVehicles.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                配車がありません
              </h3>
              <p className="text-muted-foreground mb-4">
                イベントに配車を設定してください
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSummaries.map((summary) => (
            <motion.div key={summary.event.id} variants={itemVariants}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    {/* 色付きバー */}
                    <div
                      className={`w-2 flex-shrink-0 rounded-l-lg ${
                        summary.event.event_type === 'practice'
                          ? 'bg-primary'
                          : summary.event.event_type === 'game'
                          ? 'bg-accent'
                          : 'bg-muted-foreground'
                      }`}
                    />
                    
                    <div className="flex-1 p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-semibold text-foreground">
                              {summary.event.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={
                                summary.event.event_type === 'practice'
                                  ? 'bg-primary/10 text-primary'
                                  : summary.event.event_type === 'game'
                                  ? 'bg-accent/10 text-accent'
                                  : 'bg-muted text-muted-foreground'
                              }
                            >
                              {EVENT_TYPE_LABELS[summary.event.event_type]}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(summary.event.event_date), 'M月d日(E)', { locale: ja })}
                            </span>
                            {summary.event.start_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {summary.event.start_time}
                                {summary.event.end_time && ` - ${summary.event.end_time}`}
                              </span>
                            )}
                            {summary.event.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {summary.event.location}
                              </span>
                            )}
                          </div>

                          {/* 配車サマリー */}
                          <div className="flex flex-wrap gap-3 pt-2">
                            {summary.arrangements.map((arrangement) => (
                              <div 
                                key={arrangement.id}
                                className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-full text-sm"
                              >
                                {arrangement.vehicle_type === 'personal' ? (
                                  <>
                                    <Car className="h-4 w-4 text-primary" />
                                    <span>{arrangement.driver?.name}の車</span>
                                  </>
                                ) : (
                                  <>
                                    <Bus className="h-4 w-4 text-accent" />
                                    <span>{arrangement.bus_name}</span>
                                  </>
                                )}
                                <Badge variant="secondary" className="ml-1">
                                  {arrangement.passengers?.length || 0}/{arrangement.capacity}名
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* 配車状況 */}
                          <div className="text-center min-w-[80px]">
                            <div className="flex items-center justify-center gap-1 text-lg font-semibold">
                              <Users className="h-5 w-5 text-muted-foreground" />
                              <span className={
                                summary.totalPassengers === summary.totalCapacity
                                  ? 'text-green-600'
                                  : summary.totalPassengers === 0
                                  ? 'text-muted-foreground'
                                  : 'text-primary'
                              }>
                                {summary.totalPassengers}
                              </span>
                              <span className="text-muted-foreground">/</span>
                              <span className="text-muted-foreground">{summary.totalCapacity}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">乗車人数</p>
                          </div>

                          {/* 詳細ボタン */}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/events/${summary.event.id}/vehicles`}>
                              配車設定
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </PageContainer>
  );
}





