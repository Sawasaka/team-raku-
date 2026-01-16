'use client';

import { useState, use } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Car, 
  Bus, 
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  Plus,
  Trash2,
  UserPlus,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { PageContainer } from '@/components/layout/PageContainer';
import { EVENT_TYPE_LABELS } from '@/lib/constants';
import { 
  getEventById, 
  getVehicleArrangementsByEventId, 
  mockUsers 
} from '@/lib/mock-data';
import { VehicleArrangementWithDetails, VehicleType, User } from '@/types';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventVehiclesPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  
  const event = getEventById(eventId);
  const initialArrangements = getVehicleArrangementsByEventId(eventId);
  
  const [arrangements, setArrangements] = useState<VehicleArrangementWithDetails[]>(initialArrangements);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [isAddPassengerOpen, setIsAddPassengerOpen] = useState(false);
  const [selectedArrangementId, setSelectedArrangementId] = useState<string | null>(null);
  
  // 新規車両フォーム
  const [newVehicle, setNewVehicle] = useState({
    vehicle_type: 'personal' as VehicleType,
    driver_id: '',
    bus_name: '',
    capacity: 4,
    departure_location: '',
    departure_time: '',
    destination: event?.location || '',
    notes: '',
  });

  if (!event) {
    return (
      <PageContainer title="イベントが見つかりません">
        <Card className="border-0 shadow-md">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">
              指定されたイベントは存在しません
            </p>
            <Button asChild>
              <Link href="/admin/events">
                <ArrowLeft className="mr-2 h-4 w-4" />
                イベント一覧に戻る
              </Link>
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  // 既に割り当て済みのユーザーID一覧
  const assignedUserIds = new Set(
    arrangements.flatMap(a => [
      a.driver_id,
      ...(a.passengers?.map(p => p.user_id) || [])
    ].filter(Boolean))
  );

  // まだ割り当てられていないユーザー一覧
  const availableUsers = mockUsers.filter(user => !assignedUserIds.has(user.id));

  const handleAddVehicle = () => {
    const newArrangement: VehicleArrangementWithDetails = {
      id: `vehicle-new-${Date.now()}`,
      event_id: eventId,
      vehicle_type: newVehicle.vehicle_type,
      driver_id: newVehicle.vehicle_type === 'personal' ? newVehicle.driver_id : undefined,
      bus_name: newVehicle.vehicle_type === 'bus' ? newVehicle.bus_name : undefined,
      capacity: newVehicle.capacity,
      departure_location: newVehicle.departure_location,
      departure_time: newVehicle.departure_time,
      destination: newVehicle.destination,
      notes: newVehicle.notes || undefined,
      created_at: new Date().toISOString(),
      event,
      driver: newVehicle.vehicle_type === 'personal' 
        ? mockUsers.find(u => u.id === newVehicle.driver_id)
        : undefined,
      passengers: [],
    };

    setArrangements([...arrangements, newArrangement]);
    setIsAddVehicleOpen(false);
    setNewVehicle({
      vehicle_type: 'personal',
      driver_id: '',
      bus_name: '',
      capacity: 4,
      departure_location: '',
      departure_time: '',
      destination: event.location || '',
      notes: '',
    });
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    setArrangements(arrangements.filter(a => a.id !== vehicleId));
  };

  const handleAddPassenger = (userId: string) => {
    if (!selectedArrangementId) return;

    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;

    setArrangements(arrangements.map(arrangement => {
      if (arrangement.id === selectedArrangementId) {
        return {
          ...arrangement,
          passengers: [
            ...(arrangement.passengers || []),
            {
              id: `passenger-new-${Date.now()}`,
              arrangement_id: arrangement.id,
              user_id: userId,
              status: 'assigned' as const,
              created_at: new Date().toISOString(),
              user,
            },
          ],
        };
      }
      return arrangement;
    }));
    setIsAddPassengerOpen(false);
    setSelectedArrangementId(null);
  };

  const handleRemovePassenger = (arrangementId: string, passengerId: string) => {
    setArrangements(arrangements.map(arrangement => {
      if (arrangement.id === arrangementId) {
        return {
          ...arrangement,
          passengers: arrangement.passengers?.filter(p => p.id !== passengerId) || [],
        };
      }
      return arrangement;
    }));
  };

  const openAddPassengerDialog = (arrangementId: string) => {
    setSelectedArrangementId(arrangementId);
    setIsAddPassengerOpen(true);
  };

  // 選択した車両の運転者を除く利用可能なユーザー
  const getAvailablePassengers = () => {
    const selectedArrangement = arrangements.find(a => a.id === selectedArrangementId);
    const driverId = selectedArrangement?.driver_id;
    return availableUsers.filter(user => user.id !== driverId);
  };

  return (
    <PageContainer
      title={`${event.title} - 配車設定`}
      description="車両の追加と乗車割り当てを行います"
      actions={
        <Button variant="ghost" asChild>
          <Link href="/admin/vehicles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            配車管理に戻る
          </Link>
        </Button>
      }
    >
      {/* イベント情報 */}
      <Card className="border-0 shadow-md mb-6">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-4">
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
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {format(new Date(event.event_date), 'yyyy年M月d日(E)', { locale: ja })}
            </span>
            {event.start_time && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {event.start_time}
                {event.end_time && ` - ${event.end_time}`}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 車両追加ボタン */}
      <div className="mb-6">
        <Dialog open={isAddVehicleOpen} onOpenChange={setIsAddVehicleOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              車両を追加
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>車両を追加</DialogTitle>
              <DialogDescription>
                個人の車またはバスを追加します
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>車両タイプ</Label>
                <Select
                  value={newVehicle.vehicle_type}
                  onValueChange={(value: VehicleType) => 
                    setNewVehicle({ ...newVehicle, vehicle_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        個人の車
                      </div>
                    </SelectItem>
                    <SelectItem value="bus">
                      <div className="flex items-center gap-2">
                        <Bus className="h-4 w-4" />
                        バス
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newVehicle.vehicle_type === 'personal' ? (
                <div className="grid gap-2">
                  <Label>運転者</Label>
                  <Select
                    value={newVehicle.driver_id}
                    onValueChange={(value) => 
                      setNewVehicle({ ...newVehicle, driver_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="運転者を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Label>バス名称</Label>
                  <Input
                    placeholder="例: チームバス、大型バス（レンタル）"
                    value={newVehicle.bus_name}
                    onChange={(e) => 
                      setNewVehicle({ ...newVehicle, bus_name: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="grid gap-2">
                <Label>定員</Label>
                <Input
                  type="number"
                  min={1}
                  value={newVehicle.capacity}
                  onChange={(e) => 
                    setNewVehicle({ ...newVehicle, capacity: parseInt(e.target.value) || 1 })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>出発場所</Label>
                <Input
                  placeholder="例: 駅前ロータリー、グラウンド前"
                  value={newVehicle.departure_location}
                  onChange={(e) => 
                    setNewVehicle({ ...newVehicle, departure_location: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>出発時間</Label>
                <Input
                  type="time"
                  value={newVehicle.departure_time}
                  onChange={(e) => 
                    setNewVehicle({ ...newVehicle, departure_time: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>目的地</Label>
                <Input
                  placeholder="例: △△球場"
                  value={newVehicle.destination}
                  onChange={(e) => 
                    setNewVehicle({ ...newVehicle, destination: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>備考（任意）</Label>
                <Textarea
                  placeholder="例: 高速道路使用、集合時間厳守"
                  value={newVehicle.notes}
                  onChange={(e) => 
                    setNewVehicle({ ...newVehicle, notes: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddVehicleOpen(false)}>
                キャンセル
              </Button>
              <Button 
                onClick={handleAddVehicle}
                disabled={
                  (newVehicle.vehicle_type === 'personal' && !newVehicle.driver_id) ||
                  (newVehicle.vehicle_type === 'bus' && !newVehicle.bus_name) ||
                  !newVehicle.departure_location ||
                  !newVehicle.departure_time
                }
              >
                追加
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 車両一覧 */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence>
          {arrangements.length === 0 ? (
            <Card className="border-0 shadow-md">
              <CardContent className="p-12 text-center">
                <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  車両がありません
                </h3>
                <p className="text-muted-foreground">
                  「車両を追加」ボタンから車両を追加してください
                </p>
              </CardContent>
            </Card>
          ) : (
            arrangements.map((arrangement) => (
              <motion.div
                key={arrangement.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="border-0 shadow-md overflow-hidden">
                  <CardHeader className={`pb-3 ${
                    arrangement.vehicle_type === 'personal' 
                      ? 'bg-gradient-to-r from-primary/5 to-transparent' 
                      : 'bg-gradient-to-r from-accent/5 to-transparent'
                  }`}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        {arrangement.vehicle_type === 'personal' ? (
                          <>
                            <Car className="h-5 w-5 text-primary" />
                            {arrangement.driver?.name}さんの車
                          </>
                        ) : (
                          <>
                            <Bus className="h-5 w-5 text-accent" />
                            {arrangement.bus_name}
                          </>
                        )}
                        <Badge variant="secondary">
                          {arrangement.passengers?.length || 0}/{arrangement.capacity}名
                        </Badge>
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveVehicle(arrangement.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {arrangement.departure_time} 出発
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {arrangement.departure_location}
                      </span>
                      <span>→ {arrangement.destination}</span>
                    </div>
                    {arrangement.notes && (
                      <p className="text-sm text-muted-foreground mt-1 italic">
                        {arrangement.notes}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm text-muted-foreground">乗車者</Label>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openAddPassengerDialog(arrangement.id)}
                          disabled={(arrangement.passengers?.length || 0) >= arrangement.capacity}
                        >
                          <UserPlus className="mr-1 h-4 w-4" />
                          追加
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 min-h-[40px]">
                        <AnimatePresence>
                          {arrangement.passengers && arrangement.passengers.length > 0 ? (
                            arrangement.passengers.map((passenger) => (
                              <motion.div
                                key={passenger.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-full"
                              >
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{passenger.user?.name}</span>
                                {passenger.status === 'confirmed' && (
                                  <Check className="h-3 w-3 text-green-600" />
                                )}
                                <button
                                  onClick={() => handleRemovePassenger(arrangement.id, passenger.id)}
                                  className="ml-1 p-0.5 hover:bg-destructive/20 rounded-full transition-colors"
                                >
                                  <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
                                </button>
                              </motion.div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground py-2">
                              乗車者がいません
                            </p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* 乗客追加ダイアログ */}
      <Dialog open={isAddPassengerOpen} onOpenChange={setIsAddPassengerOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>乗客を追加</DialogTitle>
            <DialogDescription>
              この車両に乗車するメンバーを選択してください
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 max-h-[300px] overflow-y-auto">
            {getAvailablePassengers().length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                追加可能なメンバーがいません
              </p>
            ) : (
              <div className="space-y-2">
                {getAvailablePassengers().map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleAddPassenger(user.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPassengerOpen(false)}>
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}





