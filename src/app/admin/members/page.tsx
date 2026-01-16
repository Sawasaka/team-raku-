'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Users,
  Copy,
  Check,
  Shield,
  ShieldCheck,
  User,
  MoreHorizontal,
  Mail,
  CalendarPlus,
  ClipboardCheck,
  Car,
  Eye,
  X,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PageContainer } from '@/components/layout/PageContainer';
import { toast } from 'sonner';
import { USER_ROLE_LABELS } from '@/lib/constants';
import type { UserRole } from '@/types';

// 権限の定義
const permissions = [
  { key: 'view', label: '予定・当番の確認', icon: Eye },
  { key: 'schedule', label: '予定管理', icon: CalendarPlus },
  { key: 'duty', label: '当番管理', icon: ClipboardCheck },
  { key: 'vehicle', label: '配車管理', icon: Car },
  { key: 'member', label: 'メンバー管理', icon: Users },
];

const rolePermissions: Record<UserRole, string[]> = {
  super_admin: ['view', 'schedule', 'duty', 'vehicle', 'member'],
  admin: ['view', 'schedule', 'duty', 'vehicle'],
  member: ['view'],
};

// モックデータ
const mockMembers = [
  { id: '1', name: '山田 太郎', email: 'yamada@example.com', role: 'super_admin' as UserRole, avatar_url: null },
  { id: '2', name: '佐藤 花子', email: 'sato@example.com', role: 'admin' as UserRole, avatar_url: null },
  { id: '3', name: '鈴木 次郎', email: 'suzuki@example.com', role: 'member' as UserRole, avatar_url: null },
  { id: '4', name: '田中 三郎', email: 'tanaka@example.com', role: 'member' as UserRole, avatar_url: null },
  { id: '5', name: '高橋 四郎', email: 'takahashi@example.com', role: 'member' as UserRole, avatar_url: null },
  { id: '6', name: '渡辺 五郎', email: 'watanabe@example.com', role: 'member' as UserRole, avatar_url: null },
];

const inviteLink = 'https://team-raku.vercel.app/register?invite=sample-invite-token-123';

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [copied, setCopied] = useState(false);
  const [showPermissions, setShowPermissions] = useState(false);

  const filteredMembers = mockMembers.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast.success('招待リンクをコピーしました');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('コピーに失敗しました');
    }
  };

  const handleRoleChange = (memberId: string, newRole: UserRole) => {
    // TODO: Supabaseで更新
    toast.success('権限を変更しました');
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <ShieldCheck className="h-4 w-4 text-primary" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-indigo-600" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'bg-primary/10 text-primary';
      case 'admin':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-secondary text-muted-foreground';
    }
  };

  return (
    <PageContainer
      title="メンバー管理"
      description="チームメンバーを管理します"
    >
      {/* 招待リンク */}
      <Card className="border-0 shadow-md mb-6 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">新しいメンバーを招待</h3>
                <p className="text-sm text-muted-foreground">
                  招待リンクを共有してメンバーを追加できます
                </p>
              </div>
            </div>
            <Button onClick={handleCopyLink} variant={copied ? 'secondary' : 'default'}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  コピーしました
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  招待リンクをコピー
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 権限一覧（アコーディオン） */}
      <Card className="border-0 shadow-md mb-6">
        <button
          onClick={() => setShowPermissions(!showPermissions)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition-colors rounded-xl"
        >
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium">権限について</span>
          </div>
          <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${showPermissions ? 'rotate-180' : ''}`} />
        </button>
        
        {showPermissions && (
          <CardContent className="pt-0 pb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">機能</th>
                    <th className="text-center py-3 px-2">
                      <div className="flex flex-col items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium">スーパー管理者</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-2">
                      <div className="flex flex-col items-center gap-1">
                        <Shield className="h-4 w-4 text-indigo-600" />
                        <span className="text-xs font-medium">管理者</span>
                      </div>
                    </th>
                    <th className="text-center py-3 px-2">
                      <div className="flex flex-col items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium">メンバー</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((perm) => (
                    <tr key={perm.key} className="border-b last:border-0">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <perm.icon className="h-4 w-4 text-muted-foreground" />
                          <span>{perm.label}</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2">
                        {rolePermissions.super_admin.includes(perm.key) ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3 px-2">
                        {rolePermissions.admin.includes(perm.key) ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-3 px-2">
                        {rolePermissions.member.includes(perm.key) ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4 px-2">
              ※ スーパー管理者のみ、他のメンバーをスーパー管理者に昇格させることができます
            </p>
          </CardContent>
        )}
      </Card>

      {/* フィルター */}
      <Card className="border-0 shadow-md mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="名前やメールで検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="権限" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべて</SelectItem>
                <SelectItem value="super_admin">スーパー管理者</SelectItem>
                <SelectItem value="admin">管理者</SelectItem>
                <SelectItem value="member">メンバー</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* メンバー一覧 */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">メンバー一覧</CardTitle>
          <CardDescription>{filteredMembers.length}人のメンバー</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {member.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{member.name}</p>
                    <Badge variant="secondary" className={getRoleBadgeVariant(member.role)}>
                      {getRoleIcon(member.role)}
                      <span className="ml-1">{USER_ROLE_LABELS[member.role]}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {member.email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'super_admin')}>
                      <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                      スーパー管理者に設定
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'admin')}>
                      <Shield className="mr-2 h-4 w-4 text-indigo-600" />
                      管理者に設定
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoleChange(member.id, 'member')}>
                      <User className="mr-2 h-4 w-4" />
                      メンバーに設定
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      チームから削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

