'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Pencil, 
  Trash2,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// イベントタイプ
type EventType = 'practice' | 'game' | 'tournament' | 'event';

const eventTypeLabels: Record<EventType, string> = {
  practice: '練習',
  game: '試合',
  tournament: '大会',
  event: 'イベント',
};

const eventTypeColors: Record<EventType, string> = {
  practice: 'bg-primary/10 text-primary border-primary/20',
  game: 'bg-green-100 text-green-700 border-green-200',
  tournament: 'bg-amber-100 text-amber-700 border-amber-200',
  event: 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

// モック予定データ
const initialSchedules = [
  { id: '1', title: '練習', type: 'practice' as EventType, date: '2025-12-27', startTime: '09:00', endTime: '12:00', location: '〇〇グラウンド', meetTime: '08:45', description: '' },
  { id: '2', title: '練習試合', type: 'game' as EventType, date: '2025-12-28', startTime: '08:30', endTime: '17:00', location: '△△球場', meetTime: '07:30', description: 'vs ○○チーム' },
  { id: '3', title: '初練習', type: 'practice' as EventType, date: '2026-01-03', startTime: '09:00', endTime: '12:00', location: '〇〇グラウンド', meetTime: '08:45', description: '' },
  { id: '4', title: '新春大会', type: 'tournament' as EventType, date: '2026-01-04', startTime: '08:00', endTime: '18:00', location: '○○市営球場', meetTime: '06:30', description: '1回戦 vs △△チーム' },
  { id: '5', title: '保護者会', type: 'event' as EventType, date: '2026-02-01', startTime: '14:00', endTime: '16:00', location: '〇〇公民館', meetTime: '13:45', description: '年間スケジュール確認' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    type: 'practice' as EventType,
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    meetTime: '',
    description: '',
  });

  const handleOpenDialog = (schedule?: typeof initialSchedules[0]) => {
    if (schedule) {
      setEditingId(schedule.id);
      setFormData({
        title: schedule.title,
        type: schedule.type,
        date: schedule.date,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        location: schedule.location,
        meetTime: schedule.meetTime,
        description: schedule.description,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        type: 'practice',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        meetTime: '',
        description: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.startTime || !formData.location) {
      alert('必須項目を入力してください');
      return;
    }

    if (editingId) {
      setSchedules(schedules.map(s => 
        s.id === editingId ? { ...formData, id: editingId } : s
      ));
    } else {
      setSchedules([...schedules, { ...formData, id: `new-${Date.now()}` }]);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('この予定を削除してもよろしいですか？')) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  // 日付でソート
  const sortedSchedules = [...schedules].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <PageContainer
      title="予定管理"
      description="チームの予定を作成・管理します"
      actions={
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          予定を追加
        </Button>
      }
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {sortedSchedules.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">予定がありません</h3>
              <p className="text-muted-foreground mb-4">
                「予定を追加」ボタンから新しい予定を作成してください
              </p>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                予定を追加
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedSchedules.map((schedule) => (
            <motion.div key={schedule.id} variants={itemVariants}>
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1">
                      {/* 日付 */}
                      <div className="text-center min-w-[70px] py-2 px-3 bg-secondary/50 rounded-lg">
                        <p className="text-2xl font-bold text-foreground">
                          {format(new Date(schedule.date), 'd')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(schedule.date), 'M月 (E)', { locale: ja })}
                        </p>
                      </div>

                      {/* 詳細 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={eventTypeColors[schedule.type]}>
                            {eventTypeLabels[schedule.type]}
                          </Badge>
                          <h3 className="font-semibold text-lg">{schedule.title}</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{schedule.startTime} - {schedule.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{schedule.location}</span>
                          </div>
                          {schedule.meetTime && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              <span>集合 {schedule.meetTime}</span>
                            </div>
                          )}
                        </div>

                        {schedule.description && (
                          <p className="mt-2 text-sm text-muted-foreground bg-secondary/30 p-2 rounded">
                            {schedule.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* アクション */}
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(schedule)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* 予定追加/編集ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingId ? '予定を編集' : '新しい予定を追加'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                種類 *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: EventType) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="practice">練習</SelectItem>
                  <SelectItem value="game">試合</SelectItem>
                  <SelectItem value="tournament">大会</SelectItem>
                  <SelectItem value="event">イベント</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                タイトル *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="col-span-3"
                placeholder="例: 練習、○○大会 1回戦"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                日付 *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                時間 *
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="flex-1"
                />
                <span>〜</span>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meetTime" className="text-right">
                集合時間
              </Label>
              <Input
                id="meetTime"
                type="time"
                value={formData.meetTime}
                onChange={(e) => setFormData({ ...formData, meetTime: e.target.value })}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                場所 *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="col-span-3"
                placeholder="例: 〇〇グラウンド"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                備考
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-3"
                placeholder="例: vs ○○チーム、持ち物など"
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>
              {editingId ? '保存' : '追加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}





