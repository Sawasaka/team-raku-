'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell,
  Check,
  Calendar,
  RefreshCw,
  Users,
  CheckCheck
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageContainer } from '@/components/layout/PageContainer';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'duty_assigned' | 'swap_request' | 'swap_approved' | 'swap_rejected' | 'reminder';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

// モックデータ
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'duty_assigned',
    title: '新しい当番が割り当てられました',
    message: '1月5日 練習試合 - 記録係',
    link: '/events/1',
    is_read: false,
    created_at: '2024-12-24T10:00:00Z',
  },
  {
    id: '2',
    type: 'swap_approved',
    title: '交代リクエストが承認されました',
    message: '12月28日 練習の当番を交代しました',
    link: '/events/2',
    is_read: false,
    created_at: '2024-12-23T15:00:00Z',
  },
  {
    id: '3',
    type: 'reminder',
    title: '当番のお知らせ',
    message: '明日は1月5日 練習試合です。記録係の当番です。',
    link: '/events/1',
    is_read: false,
    created_at: '2024-12-23T09:00:00Z',
  },
  {
    id: '4',
    type: 'duty_assigned',
    title: '新しい当番が割り当てられました',
    message: '1月12日 練習 - 配車係',
    link: '/events/3',
    is_read: true,
    created_at: '2024-12-22T14:00:00Z',
  },
  {
    id: '5',
    type: 'swap_rejected',
    title: '交代リクエストが却下されました',
    message: '12月20日 練習の交代リクエストは却下されました',
    is_read: true,
    created_at: '2024-12-21T11:00:00Z',
  },
];

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'duty_assigned':
      return <Calendar className="h-5 w-5 text-primary" />;
    case 'swap_request':
    case 'swap_approved':
    case 'swap_rejected':
      return <RefreshCw className="h-5 w-5 text-indigo-600" />;
    case 'reminder':
      return <Bell className="h-5 w-5 text-accent" />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    toast.success('すべて既読にしました');
  };

  return (
    <PageContainer
      title="お知らせ"
      description="当番やリクエストに関する通知"
      actions={
        unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            すべて既読にする
          </Button>
        )
      }
    >
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            通知一覧
            {unreadCount > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {unreadCount}
              </span>
            )}
          </CardTitle>
          <CardDescription>最新の通知を確認できます</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {notification.link ? (
                    <Link href={notification.link} onClick={() => markAsRead(notification.id)}>
                      <NotificationItem notification={notification} />
                    </Link>
                  ) : (
                    <div onClick={() => markAsRead(notification.id)}>
                      <NotificationItem notification={notification} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">通知はありません</p>
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer ${
        notification.is_read
          ? 'bg-secondary/30 hover:bg-secondary/50'
          : 'bg-primary/5 border-l-2 border-primary hover:bg-primary/10'
      }`}
    >
      <div className={`p-2 rounded-full ${notification.is_read ? 'bg-secondary' : 'bg-primary/10'}`}>
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${notification.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>
          {notification.title}
        </p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: ja })}
        </p>
      </div>
      {!notification.is_read && (
        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
      )}
    </div>
  );
}

