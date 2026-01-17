import { EventType } from '@/types';

// イベントタイプのラベル
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  practice: '練習',
  game: '試合',
  tournament: '大会',
  other: 'その他',
};

// イベントタイプの色
export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  practice: '#0ea5e9', // スカイブルー
  game: '#22c55e',     // グリーン
  tournament: '#f59e0b', // アンバー
  other: '#64748b',    // グレー
};

// デフォルトの当番カテゴリ（練習）
export const DEFAULT_PRACTICE_CATEGORIES = [
  { name: 'グラウンド整備', color: '#0ea5e9' },
  { name: 'マネージャー業', color: '#38bdf8' },
  { name: '配車係', color: '#7dd3fc' },
  { name: '道具係', color: '#0284c7' },
];

// デフォルトの当番カテゴリ（試合）
export const DEFAULT_GAME_CATEGORIES = [
  { name: 'お茶係', color: '#f97316' },
  { name: 'グラウンド整備', color: '#fb923c' },
  { name: '審判', color: '#fdba74' },
  { name: '記録係', color: '#ea580c' },
  { name: 'アナウンス', color: '#c2410c' },
  { name: '配車係', color: '#9a3412' },
  { name: '道具係', color: '#7c2d12' },
  { name: '炊き出し', color: '#fed7aa' },
];

// 出欠ステータスのラベル
export const ATTENDANCE_STATUS_LABELS = {
  yes: '参加',
  maybe: '未定',
  no: '不参加',
};

// 出欠ステータスのアイコン
export const ATTENDANCE_STATUS_ICONS = {
  yes: '◯',
  maybe: '△',
  no: '✕',
};

// 当番ステータスのラベル
export const DUTY_STATUS_LABELS = {
  assigned: '割当済',
  confirmed: '確認済',
  completed: '完了',
};

// 交代リクエストステータスのラベル
export const SWAP_REQUEST_STATUS_LABELS = {
  pending: '申請中',
  approved: '承認',
  rejected: '却下',
};

// ユーザー権限のラベル
export const USER_ROLE_LABELS = {
  super_admin: 'スーパー管理者',
  admin: '管理者',
  member: 'メンバー',
};

// アプリ情報
export const APP_NAME = 'チーム楽';
export const APP_DESCRIPTION = 'チーム楽 - お当番管理アプリ';





