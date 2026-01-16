'use client';

import { motion } from 'framer-motion';
import { 
  Car, 
  Bus, 
  Calendar,
  MapPin,
  Clock,
  Users,
  Navigation,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/layout/PageContainer';
import { EVENT_TYPE_LABELS } from '@/lib/constants';
import { 
  getVehicleArrangementsByPassengerId,
  getVehicleArrangementsByDriverId,
} from '@/lib/mock-data';
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

// モックの現在ユーザーID（実際の実装ではセッションから取得）
const currentUserId = 'user-2';

export default function UserVehiclesPage() {
  // 自分が乗客として割り当てられている配車
  const passengerArrangements = getVehicleArrangementsByPassengerId(currentUserId);
  
  // 自分が運転者として割り当てられている配車
  const driverArrangements = getVehicleArrangementsByDriverId(currentUserId);

  // すべての配車を日付順にソート
  const allArrangements = [...passengerArrangements, ...driverArrangements]
    .sort((a, b) => {
      const dateA = new Date(a.event?.event_date || '');
      const dateB = new Date(b.event?.event_date || '');
      return dateA.getTime() - dateB.getTime();
    });

  // 重複を除去
  const uniqueArrangements = allArrangements.filter(
    (arrangement, index, self) => 
      index === self.findIndex(a => a.id === arrangement.id)
  );

  const isDriver = (arrangementId: string) => {
    return driverArrangements.some(a => a.id === arrangementId);
  };

  return (
    <PageContainer
      title="配車予定"
      description="あなたの配車予定を確認できます"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {uniqueArrangements.length === 0 ? (
          <Card className="border-0 shadow-md">
            <CardContent className="p-12 text-center">
              <Navigation className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                配車予定がありません
              </h3>
              <p className="text-muted-foreground">
                配車が割り当てられるとここに表示されます
              </p>
            </CardContent>
          </Card>
        ) : (
          uniqueArrangements.map((arrangement) => {
            const event = arrangement.event;
            if (!event) return null;

            const isDriverRole = isDriver(arrangement.id);
            const myPassenger = arrangement.passengers?.find(p => p.user_id === currentUserId);
            const isConfirmed = myPassenger?.status === 'confirmed';

            return (
              <motion.div key={arrangement.id} variants={itemVariants}>
                <Card className="border-0 shadow-md overflow-hidden">
                  {/* イベント情報ヘッダー */}
                  <CardHeader className={`pb-3 ${
                    event.event_type === 'practice'
                      ? 'bg-gradient-to-r from-primary/5 to-transparent'
                      : event.event_type === 'game'
                      ? 'bg-gradient-to-r from-accent/5 to-transparent'
                      : 'bg-gradient-to-r from-muted/50 to-transparent'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
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
                        <CardTitle className="text-base">{event.title}</CardTitle>
                      </div>
                      {isDriverRole && (
                        <Badge className="bg-primary text-white">
                          <Car className="mr-1 h-3 w-3" />
                          運転担当
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(event.event_date), 'yyyy年M月d日(E)', { locale: ja })}
                      </span>
                      {event.start_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.start_time}
                          {event.end_time && ` - ${event.end_time}`}
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-4">
                    {/* 配車情報カード */}
                    <div className={`rounded-xl p-4 ${
                      arrangement.vehicle_type === 'personal'
                        ? 'bg-primary/5 border border-primary/20'
                        : 'bg-accent/5 border border-accent/20'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${
                          arrangement.vehicle_type === 'personal'
                            ? 'bg-primary/10'
                            : 'bg-accent/10'
                        }`}>
                          {arrangement.vehicle_type === 'personal' ? (
                            <Car className={`h-6 w-6 ${
                              arrangement.vehicle_type === 'personal' 
                                ? 'text-primary' 
                                : 'text-accent'
                            }`} />
                          ) : (
                            <Bus className="h-6 w-6 text-accent" />
                          )}
                        </div>

                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="font-semibold text-foreground">
                              {arrangement.vehicle_type === 'personal'
                                ? `${arrangement.driver?.name}さんの車で移動`
                                : `${arrangement.bus_name}で移動`
                              }
                            </h4>
                            {!isDriverRole && (
                              <div className="flex items-center gap-1 mt-1">
                                {isConfirmed ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Circle className="h-4 w-4 text-amber-500" />
                                )}
                                <span className={`text-sm ${
                                  isConfirmed ? 'text-green-600' : 'text-amber-500'
                                }`}>
                                  {isConfirmed ? '確認済み' : '未確認'}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-start gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-muted-foreground">出発時間</p>
                                <p className="font-medium">{arrangement.departure_time}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-muted-foreground">集合場所</p>
                                <p className="font-medium">{arrangement.departure_location}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 sm:col-span-2">
                              <Navigation className="h-4 w-4 text-muted-foreground mt-0.5" />
                              <div>
                                <p className="text-muted-foreground">目的地</p>
                                <p className="font-medium">{arrangement.destination}</p>
                              </div>
                            </div>
                          </div>

                          {/* 同乗者 */}
                          {arrangement.passengers && arrangement.passengers.length > 0 && (
                            <div className="pt-2 border-t border-border/50">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {isDriverRole ? '乗車予定者' : '同乗者'}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {arrangement.passengers
                                  .filter(p => isDriverRole || p.user_id !== currentUserId)
                                  .map((passenger) => (
                                    <span 
                                      key={passenger.id}
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-background rounded-full text-sm"
                                    >
                                      {passenger.user?.name}
                                      {passenger.status === 'confirmed' && (
                                        <CheckCircle2 className="h-3 w-3 text-green-600" />
                                      )}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}

                          {/* 備考 */}
                          {arrangement.notes && (
                            <p className="text-sm text-muted-foreground italic pt-2 border-t border-border/50">
                              📝 {arrangement.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </PageContainer>
  );
}





