'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RefreshCw,
  Check,
  X,
  Calendar,
  User,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageContainer } from '@/components/layout/PageContainer';
import { toast } from 'sonner';
import { SWAP_REQUEST_STATUS_LABELS } from '@/lib/constants';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { SwapRequestStatus } from '@/types';

interface SwapRequest {
  id: string;
  requester: { id: string; name: string; avatar_url: string | null };
  targetUser: { id: string; name: string; avatar_url: string | null } | null;
  event: { id: string; title: string; event_date: string; event_type: string };
  duty: string;
  reason: string;
  status: SwapRequestStatus;
  created_at: string;
}

// モックデータ
const mockRequests: SwapRequest[] = [
  {
    id: '1',
    requester: { id: '1', name: '山田 太郎', avatar_url: null },
    targetUser: { id: '2', name: '佐藤 花子', avatar_url: null },
    event: { id: '1', title: '1月5日 練習試合', event_date: '2025-01-05', event_type: 'game' },
    duty: '記録係',
    reason: '仕事の都合で参加できなくなりました。',
    status: 'pending',
    created_at: '2024-12-24T10:00:00Z',
  },
  {
    id: '2',
    requester: { id: '3', name: '鈴木 次郎', avatar_url: null },
    targetUser: null,
    event: { id: '2', title: '1月12日 練習', event_date: '2025-01-12', event_type: 'practice' },
    duty: '配車係',
    reason: '子供の学校行事と重なってしまいました。',
    status: 'pending',
    created_at: '2024-12-23T15:00:00Z',
  },
  {
    id: '3',
    requester: { id: '4', name: '田中 三郎', avatar_url: null },
    targetUser: { id: '5', name: '高橋 四郎', avatar_url: null },
    event: { id: '3', title: '12月28日 練習', event_date: '2024-12-28', event_type: 'practice' },
    duty: 'グラウンド整備',
    reason: '急な出張が入りました。',
    status: 'approved',
    created_at: '2024-12-22T09:00:00Z',
  },
];

export default function RequestsPage() {
  const [requests, setRequests] = useState<SwapRequest[]>(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const processedRequests = requests.filter(r => r.status !== 'pending');

  const handleApprove = (id: string) => {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'approved' as SwapRequestStatus } : r)
    );
    toast.success('交代リクエストを承認しました');
    setIsDialogOpen(false);
  };

  const handleReject = (id: string) => {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: 'rejected' as SwapRequestStatus } : r)
    );
    toast.success('交代リクエストを却下しました');
    setIsDialogOpen(false);
  };

  const openDetail = (request: SwapRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: SwapRequestStatus) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">申請中</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">承認</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">却下</Badge>;
    }
  };

  const RequestCard = ({ request, showActions = false }: { request: SwapRequest; showActions?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
      onClick={() => openDetail(request)}
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={request.requester.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {request.requester.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-medium text-foreground">{request.requester.name}</span>
            {getStatusBadge(request.status)}
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {request.event.title} - {request.duty}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(request.event.event_date), 'M月d日', { locale: ja })}
            </span>
            {request.targetUser && (
              <span className="flex items-center gap-1">
                <ArrowRight className="h-3.5 w-3.5" />
                {request.targetUser.name}
              </span>
            )}
          </div>
        </div>
        {showActions && request.status === 'pending' && (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={(e) => { e.stopPropagation(); handleApprove(request.id); }}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={(e) => { e.stopPropagation(); handleReject(request.id); }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <PageContainer
      title="交代リクエスト"
      description="当番の交代リクエストを管理します"
    >
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending" className="relative">
            申請中
            {pendingRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="processed">処理済み</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                申請中のリクエスト
              </CardTitle>
              <CardDescription>承認または却下してください</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <RequestCard key={request.id} request={request} showActions />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <RefreshCw className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    申請中のリクエストはありません
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processed">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">処理済みのリクエスト</CardTitle>
              <CardDescription>過去のリクエスト履歴</CardDescription>
            </CardHeader>
            <CardContent>
              {processedRequests.length > 0 ? (
                <div className="space-y-4">
                  {processedRequests.map((request) => (
                    <RequestCard key={request.id} request={request} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    処理済みのリクエストはありません
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 詳細ダイアログ */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>交代リクエスト詳細</DialogTitle>
                <DialogDescription>
                  {format(new Date(selectedRequest.created_at), 'M月d日 HH:mm', { locale: ja })}に申請
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedRequest.requester.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedRequest.requester.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedRequest.requester.name}</p>
                    <p className="text-sm text-muted-foreground">申請者</p>
                  </div>
                  {selectedRequest.targetUser && (
                    <>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedRequest.targetUser.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {selectedRequest.targetUser.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedRequest.targetUser.name}</p>
                        <p className="text-sm text-muted-foreground">交代先</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">イベント</span>
                  </div>
                  <p className="font-medium">{selectedRequest.event.title}</p>
                  <p className="text-sm text-muted-foreground">当番: {selectedRequest.duty}</p>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">理由</span>
                  </div>
                  <p className="text-sm">{selectedRequest.reason}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">ステータス:</span>
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>
              {selectedRequest.status === 'pending' && (
                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedRequest.id)}
                    className="text-destructive"
                  >
                    <X className="mr-2 h-4 w-4" />
                    却下
                  </Button>
                  <Button onClick={() => handleApprove(selectedRequest.id)}>
                    <Check className="mr-2 h-4 w-4" />
                    承認
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}





