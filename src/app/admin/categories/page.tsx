'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  GripVertical,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { PageContainer } from '@/components/layout/PageContainer';
import { toast } from 'sonner';
import { EVENT_TYPE_LABELS } from '@/lib/constants';
import type { EventType } from '@/types';

interface Category {
  id: string;
  name: string;
  event_type: EventType;
  color: string;
  sort_order: number;
}

// モックデータ
const initialCategories: Category[] = [
  { id: '1', name: 'グラウンド整備', event_type: 'practice', color: '#0ea5e9', sort_order: 1 },
  { id: '2', name: 'マネージャー業', event_type: 'practice', color: '#38bdf8', sort_order: 2 },
  { id: '3', name: '配車係', event_type: 'practice', color: '#7dd3fc', sort_order: 3 },
  { id: '4', name: '道具係', event_type: 'practice', color: '#0284c7', sort_order: 4 },
  { id: '5', name: 'お茶係', event_type: 'game', color: '#f97316', sort_order: 1 },
  { id: '6', name: 'グラウンド整備', event_type: 'game', color: '#fb923c', sort_order: 2 },
  { id: '7', name: '審判', event_type: 'game', color: '#fdba74', sort_order: 3 },
  { id: '8', name: '記録係', event_type: 'game', color: '#ea580c', sort_order: 4 },
  { id: '9', name: 'アナウンス', event_type: 'game', color: '#c2410c', sort_order: 5 },
  { id: '10', name: '炊き出し', event_type: 'game', color: '#fed7aa', sort_order: 6 },
];

const colorPresets = [
  '#0ea5e9', '#38bdf8', '#7dd3fc', '#0284c7', '#0369a1',
  '#f97316', '#fb923c', '#fdba74', '#ea580c', '#c2410c',
  '#22c55e', '#4ade80', '#86efac',
  '#a855f7', '#c084fc', '#d8b4fe',
  '#64748b', '#94a3b8', '#cbd5e1',
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    event_type: 'practice' as EventType,
    color: '#0ea5e9',
  });

  const practiceCategories = categories.filter(c => c.event_type === 'practice');
  const gameCategories = categories.filter(c => c.event_type === 'game');

  const openNewDialog = (eventType: EventType) => {
    setEditingCategory(null);
    setFormData({
      name: '',
      event_type: eventType,
      color: eventType === 'practice' ? '#0ea5e9' : '#f97316',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      event_type: category.event_type,
      color: category.color,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast.error('カテゴリ名を入力してください');
      return;
    }

    if (editingCategory) {
      // 編集
      setCategories(prev =>
        prev.map(c =>
          c.id === editingCategory.id
            ? { ...c, name: formData.name, color: formData.color }
            : c
        )
      );
      toast.success('カテゴリを更新しました');
    } else {
      // 新規作成
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        event_type: formData.event_type,
        color: formData.color,
        sort_order: categories.filter(c => c.event_type === formData.event_type).length + 1,
      };
      setCategories(prev => [...prev, newCategory]);
      toast.success('カテゴリを追加しました');
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm('このカテゴリを削除しますか？')) return;
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success('カテゴリを削除しました');
  };

  const CategoryList = ({ items, eventType }: { items: Category[]; eventType: EventType }) => (
    <div className="space-y-2">
      {items.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
          <div
            className="w-4 h-4 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color }}
          />
          <span className="flex-1 font-medium text-foreground">{category.name}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => openEditDialog(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => handleDelete(category.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ))}
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          カテゴリがありません
        </p>
      )}
    </div>
  );

  return (
    <PageContainer
      title="当番カテゴリ管理"
      description="練習・試合の当番カテゴリをカスタマイズできます"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 練習用カテゴリ */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                練習用カテゴリ
              </CardTitle>
              <CardDescription>練習日に使用する当番の種類</CardDescription>
            </div>
            <Button size="sm" onClick={() => openNewDialog('practice')}>
              <Plus className="mr-1 h-4 w-4" />
              追加
            </Button>
          </CardHeader>
          <CardContent>
            <CategoryList items={practiceCategories} eventType="practice" />
          </CardContent>
        </Card>

        {/* 試合用カテゴリ */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent" />
                試合用カテゴリ
              </CardTitle>
              <CardDescription>試合日に使用する当番の種類</CardDescription>
            </div>
            <Button size="sm" onClick={() => openNewDialog('game')}>
              <Plus className="mr-1 h-4 w-4" />
              追加
            </Button>
          </CardHeader>
          <CardContent>
            <CategoryList items={gameCategories} eventType="game" />
          </CardContent>
        </Card>
      </div>

      {/* ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'カテゴリを編集' : '新規カテゴリ'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'カテゴリの名前と色を変更できます'
                : `${EVENT_TYPE_LABELS[formData.event_type]}用のカテゴリを追加します`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">カテゴリ名</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="例: グラウンド整備"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label>色</Label>
              <div className="flex flex-wrap gap-2">
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      formData.color === color
                        ? 'ring-2 ring-primary ring-offset-2 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-2">プレビュー</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: formData.color }}
                />
                <span className="font-medium">{formData.name || 'カテゴリ名'}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {editingCategory ? '更新' : '追加'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}





