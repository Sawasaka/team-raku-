'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageContainer } from '@/components/layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCheck, Plus, Users, Calendar, X, Trash2, RotateCcw, AlertCircle, Edit, Car, CalendarPlus, UserPlus } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// 利用可能な色
const availableColors = [
  { name: '青', value: 'bg-blue-500' },
  { name: '緑', value: 'bg-green-500' },
  { name: '紫', value: 'bg-purple-500' },
  { name: '黄', value: 'bg-amber-500' },
  { name: 'ピンク', value: 'bg-pink-500' },
  { name: '水色', value: 'bg-cyan-500' },
  { name: 'オレンジ', value: 'bg-orange-500' },
  { name: '赤', value: 'bg-red-500' },
  { name: 'インディゴ', value: 'bg-indigo-500' },
  { name: 'ティール', value: 'bg-teal-500' },
];

// カテゴリの型定義
interface DutyCategory {
  id: string;
  name: string;
  color: string;
  isActive: boolean; // true: 利用可能, false: 削除済み（新規割り当て不可）
}

// モックデータ: 当番カテゴリ（初期値）
const initialDutyCategories: DutyCategory[] = [
  { id: '1', name: 'グラウンド整備', color: 'bg-blue-500', isActive: true },
  { id: '2', name: 'お茶当番', color: 'bg-green-500', isActive: true },
  { id: '3', name: '審判', color: 'bg-purple-500', isActive: true },
  { id: '4', name: '記録係', color: 'bg-amber-500', isActive: true },
  { id: '5', name: 'アナウンス', color: 'bg-pink-500', isActive: true },
  { id: '6', name: '道具運搬', color: 'bg-cyan-500', isActive: true },
  { id: '7', name: '炊き出し', color: 'bg-orange-500', isActive: true },
];

// 当番割り当ての型定義
interface DutyAssignment {
  id: string;
  date: Date;
  event: string;
  duty: string;
  assignee: string;
}

// モックデータ: 直近の当番割り当て
const initialDuties: DutyAssignment[] = [
  { id: '1', date: new Date(2025, 11, 28), event: '練習試合', duty: 'グラウンド整備', assignee: '山田太郎' },
  { id: '2', date: new Date(2026, 0, 3), event: '初練習', duty: 'お茶当番', assignee: '佐藤花子' },
  { id: '3', date: new Date(2026, 0, 4), event: '新春大会', duty: '記録係', assignee: '鈴木一郎' },
  { id: '4', date: new Date(2026, 0, 11), event: '練習', duty: '審判', assignee: '田中美咲' },
];

// モックデータ: メンバー一覧
const members = [
  '山田太郎', '佐藤花子', '鈴木一郎', '田中美咲', '高橋健太', '渡辺優子', '伊藤大輔', '小林あゆみ'
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

export default function AdminDutiesPage() {
  const [categories, setCategories] = useState(initialDutyCategories);
  const [duties, setDuties] = useState<DutyAssignment[]>(initialDuties);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('bg-blue-500');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  // 当番編集用state
  const [isEditDutyOpen, setIsEditDutyOpen] = useState(false);
  const [editingDuty, setEditingDuty] = useState<DutyAssignment | null>(null);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory: DutyCategory = {
        id: String(Date.now()),
        name: newCategoryName.trim(),
        color: newCategoryColor,
        isActive: true,
      };
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
      setNewCategoryColor('bg-blue-500');
      setIsDialogOpen(false);
    }
  };

  // ソフトデリート: カテゴリを無効化（既存の割り当ては保持、新規割り当て不可）
  const handleDeleteCategory = (id: string) => {
    setCategories(categories.map((cat) => 
      cat.id === id ? { ...cat, isActive: false } : cat
    ));
  };

  // カテゴリを復元
  const handleRestoreCategory = (id: string) => {
    setCategories(categories.map((cat) => 
      cat.id === id ? { ...cat, isActive: true } : cat
    ));
  };

  // アクティブなカテゴリのみ（新規割り当て用）
  const activeCategories = categories.filter((cat) => cat.isActive);
  // 非アクティブなカテゴリ（削除済み）
  const inactiveCategories = categories.filter((cat) => !cat.isActive);

  // 当番編集を開始
  const handleEditDuty = (duty: DutyAssignment) => {
    setEditingDuty({ ...duty });
    setIsEditDutyOpen(true);
  };

  // 当番を保存
  const handleSaveDuty = () => {
    if (editingDuty) {
      setDuties(duties.map((d) => 
        d.id === editingDuty.id ? editingDuty : d
      ));
      setIsEditDutyOpen(false);
      setEditingDuty(null);
    }
  };

  return (
    <PageContainer
      title="当番管理"
      description="当番カテゴリと割り当てを管理します"
      actions={
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/events/new">
              <CalendarPlus className="mr-2 h-4 w-4" />
              予定を追加
            </Link>
          </Button>
          <Button variant="outline">
            <UserPlus className="mr-2 h-4 w-4" />
            当番割り当て
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/vehicles">
              <Car className="mr-2 h-4 w-4" />
              配車
            </Link>
        </Button>
        </div>
      }
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* 当番カテゴリ一覧 */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-primary" />
                当番カテゴリ
              </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  新規当番割り当てで選択可能なカテゴリ
                </p>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-muted-foreground hover:text-primary"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  追加
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  削除
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {activeCategories.map((category) => (
                  <Badge
                    key={category.id}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm cursor-pointer hover:opacity-80 transition-opacity group"
                  >
                    <div className={`w-2 h-2 rounded-full ${category.color} mr-2`} />
                    {category.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category.id);
                      }}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {activeCategories.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  利用可能なカテゴリがありません
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* 直近の当番割り当て */}
        <motion.div variants={itemVariants}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                直近の当番割り当て
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {duties.map((duty) => (
                  <div
                    key={duty.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <p className="text-xs text-muted-foreground">
                          {format(duty.date, 'M/d', { locale: ja })}
                        </p>
                        <p className="text-sm font-medium">
                          {format(duty.date, 'E', { locale: ja })}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">{duty.event}</p>
                        {(() => {
                          const category = categories.find((c) => c.name === duty.duty);
                          const isDeleted = category && !category.isActive;
                          return (
                            <Badge 
                              variant="outline" 
                              className={`mt-1 text-xs ${isDeleted ? 'border-destructive/30 text-muted-foreground' : ''}`}
                            >
                              {duty.duty}
                              {isDeleted && <span className="ml-1 text-destructive">（削除済み）</span>}
                            </Badge>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {duty.assignee}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditDuty(duty)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* カテゴリ追加ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>カテゴリを追加</DialogTitle>
            <DialogDescription>
              新しい当番カテゴリを作成します
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="categoryName">カテゴリ名</Label>
              <Input
                id="categoryName"
                placeholder="例: 送迎係"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>カラー</Label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setNewCategoryColor(color.value)}
                    className={`w-8 h-8 rounded-full ${color.value} transition-all ${
                      newCategoryColor === color.value
                        ? 'ring-2 ring-offset-2 ring-primary scale-110'
                        : 'hover:scale-105'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
              追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* カテゴリ削除ダイアログ */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>カテゴリを削除</DialogTitle>
            <DialogDescription>
              削除するカテゴリを選択してください
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* アクティブなカテゴリ */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {activeCategories.length > 0 ? (
                activeCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${category.color}`} />
                      <span className="font-medium">{category.name}</span>
                    </div>
                    {deleteConfirmId === category.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            handleDeleteCategory(category.id);
                            setDeleteConfirmId(null);
                          }}
                        >
                          削除
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          戻る
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteConfirmId(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  削除可能なカテゴリがありません
                </p>
              )}
            </div>

            {/* 削除済みカテゴリ */}
            {inactiveCategories.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  削除済みカテゴリ ({inactiveCategories.length})
                </h4>
                <div className="space-y-2">
                  {inactiveCategories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/20"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${category.color} opacity-50`} />
                        <span className="font-medium text-muted-foreground">{category.name}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestoreCategory(category.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        復元
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 当番編集ダイアログ */}
      <Dialog open={isEditDutyOpen} onOpenChange={setIsEditDutyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>当番を編集</DialogTitle>
            <DialogDescription>
              当番の割り当てを変更します
            </DialogDescription>
          </DialogHeader>
          {editingDuty && (
            <div className="space-y-4 py-4">
              <div className="p-3 rounded-lg bg-secondary/30">
                <p className="text-sm text-muted-foreground">
                  {format(editingDuty.date, 'M月d日(E)', { locale: ja })}
                </p>
                <p className="font-medium">{editingDuty.event}</p>
              </div>
              
              <div className="space-y-2">
                <Label>当番カテゴリ</Label>
                <Select
                  value={editingDuty.duty}
                  onValueChange={(value) => setEditingDuty({ ...editingDuty, duty: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {activeCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                          {cat.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>担当者</Label>
                <Select
                  value={editingDuty.assignee}
                  onValueChange={(value) => setEditingDuty({ ...editingDuty, assignee: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member} value={member}>
                        {member}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDutyOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSaveDuty}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
