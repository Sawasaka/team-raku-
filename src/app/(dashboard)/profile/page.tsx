'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Camera,
  Save,
  Loader2,
  Car,
  Calendar,
  Clock,
  ClipboardCheck,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { PageContainer } from '@/components/layout/PageContainer';
import { toast } from 'sonner';
import { mockDutyCategoryGroups, mockDutyCategories } from '@/lib/mock-data';

// モックデータ
const mockUser = {
  name: 'テストユーザー',
  email: 'test@example.com',
  avatar_url: null,
  role: 'member',
  team_name: 'チーム楽サンプル',
};

// モック: 現在の設定
const mockCurrentSettings = {
  available_saturday: true,
  available_sunday: true,
  available_holiday: false,
  start_time: '08:00',
  end_time: '17:00',
  can_drive: true,
  car_capacity: 3,
  can_load_equipment: true,
  car_model: 'プリウス',
  car_notes: '',
  capable_duties: ['cat-1', 'cat-6'], // グラウンド整備, 雑務・お手伝い
};

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
  });

  // お手伝い設定
  const [availability, setAvailability] = useState({
    available_saturday: mockCurrentSettings.available_saturday,
    available_sunday: mockCurrentSettings.available_sunday,
    available_holiday: mockCurrentSettings.available_holiday,
    start_time: mockCurrentSettings.start_time,
    end_time: mockCurrentSettings.end_time,
  });

  // 配車設定
  const [carSettings, setCarSettings] = useState({
    can_drive: mockCurrentSettings.can_drive,
    car_capacity: mockCurrentSettings.car_capacity,
    can_load_equipment: mockCurrentSettings.can_load_equipment,
    car_model: mockCurrentSettings.car_model,
    car_notes: mockCurrentSettings.car_notes,
  });

  // 対応可能当番
  const [capableDuties, setCapableDuties] = useState<string[]>(mockCurrentSettings.capable_duties);

  const handleDutyToggle = (categoryId: string) => {
    setCapableDuties(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Supabaseに保存
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('設定を保存しました');
    } catch (error) {
      toast.error('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer
      title="プロフィール設定"
      description="アカウント情報とお手伝い設定を管理します"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* プロフィール画像 */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">プロフィール画像</CardTitle>
                <CardDescription>アバター画像を設定できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={mockUser.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {formData.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button type="button" variant="outline" className="mb-2">
                      <Camera className="mr-2 h-4 w-4" />
                      画像を変更
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG, GIF形式。最大2MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 基本情報 */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">基本情報</CardTitle>
                <CardDescription>お名前とメールアドレスを設定します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    <User className="inline mr-1 h-4 w-4" />
                    お名前
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline mr-1 h-4 w-4" />
                    メールアドレス
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="h-12"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    メールアドレスは変更できません
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* お手伝い可能日時 */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  お手伝い可能な日時
                </CardTitle>
                <CardDescription>デフォルトで対応可能な曜日と時間帯を設定します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 可能な曜日 */}
                <div className="space-y-3">
                  <Label>可能な曜日</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="saturday"
                        checked={availability.available_saturday}
                        onCheckedChange={(checked) => 
                          setAvailability(prev => ({ ...prev, available_saturday: checked as boolean }))
                        }
                      />
                      <label htmlFor="saturday" className="text-sm font-medium cursor-pointer">
                        土曜日
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sunday"
                        checked={availability.available_sunday}
                        onCheckedChange={(checked) => 
                          setAvailability(prev => ({ ...prev, available_sunday: checked as boolean }))
                        }
                      />
                      <label htmlFor="sunday" className="text-sm font-medium cursor-pointer">
                        日曜日
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="holiday"
                        checked={availability.available_holiday}
                        onCheckedChange={(checked) => 
                          setAvailability(prev => ({ ...prev, available_holiday: checked as boolean }))
                        }
                      />
                      <label htmlFor="holiday" className="text-sm font-medium cursor-pointer">
                        祝日
                      </label>
                    </div>
                  </div>
                </div>

                {/* 可能な時間帯 */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    可能な時間帯
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={availability.start_time}
                      onChange={(e) => setAvailability(prev => ({ ...prev, start_time: e.target.value }))}
                      className="w-32"
                    />
                    <span className="text-muted-foreground">〜</span>
                    <Input
                      type="time"
                      value={availability.end_time}
                      onChange={(e) => setAvailability(prev => ({ ...prev, end_time: e.target.value }))}
                      className="w-32"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 対応可能な当番 */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  対応可能なお手伝い
                </CardTitle>
                <CardDescription>対応できるお手伝いの種類を選択してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockDutyCategoryGroups.map((group) => (
                  <div key={group.id} className="space-y-3">
                    <Label className="flex items-center gap-2 text-base">
                      <span>{group.icon}</span>
                      {group.name}
                    </Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-6">
                      {mockDutyCategories
                        .filter(cat => cat.group_id === group.id)
                        .map((category) => (
                          <div key={category.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={category.id}
                              checked={capableDuties.includes(category.id)}
                              onCheckedChange={() => handleDutyToggle(category.id)}
                            />
                            <div className="grid gap-0.5 leading-none">
                              <label
                                htmlFor={category.id}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {category.name}
                              </label>
                              {category.description && (
                                <p className="text-xs text-muted-foreground">
                                  {category.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 配車設定 */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  配車設定
                </CardTitle>
                <CardDescription>運転可能な場合は車の情報を設定してください</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="can_drive"
                    checked={carSettings.can_drive}
                    onCheckedChange={(checked) => 
                      setCarSettings(prev => ({ ...prev, can_drive: checked as boolean }))
                    }
                  />
                  <label htmlFor="can_drive" className="text-sm font-medium cursor-pointer">
                    運転可能
                  </label>
                </div>

                {carSettings.can_drive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pl-6 border-l-2 border-primary/20"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="car_capacity">
                        乗車可能人数（運転手除く）
                      </Label>
                      <Input
                        id="car_capacity"
                        type="number"
                        min="1"
                        max="10"
                        value={carSettings.car_capacity}
                        onChange={(e) => setCarSettings(prev => ({ 
                          ...prev, 
                          car_capacity: parseInt(e.target.value) || 0 
                        }))}
                        className="w-24"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="can_load_equipment"
                        checked={carSettings.can_load_equipment}
                        onCheckedChange={(checked) => 
                          setCarSettings(prev => ({ ...prev, can_load_equipment: checked as boolean }))
                        }
                      />
                      <label htmlFor="can_load_equipment" className="text-sm font-medium cursor-pointer flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        道具の積み込みOK
                      </label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="car_model">車種（任意）</Label>
                      <Input
                        id="car_model"
                        value={carSettings.car_model}
                        onChange={(e) => setCarSettings(prev => ({ ...prev, car_model: e.target.value }))}
                        placeholder="例: プリウス、アルファードなど"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="car_notes">備考（任意）</Label>
                      <Input
                        id="car_notes"
                        value={carSettings.car_notes}
                        onChange={(e) => setCarSettings(prev => ({ ...prev, car_notes: e.target.value }))}
                        placeholder="例: チャイルドシートあり、トランク小さめなど"
                      />
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* チーム情報 */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">チーム情報</CardTitle>
                <CardDescription>所属チームの情報</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{mockUser.team_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {mockUser.role === 'super_admin'
                          ? 'スーパー管理者'
                          : mockUser.role === 'admin'
                          ? '管理者'
                          : 'メンバー'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 保存ボタン */}
            <div className="flex justify-end">
              <Button type="submit" className="h-12 px-8" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    設定を保存
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </PageContainer>
  );
}
