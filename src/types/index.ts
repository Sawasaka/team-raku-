// ユーザーの権限
export type UserRole = 'super_admin' | 'admin' | 'member';

// イベントタイプ
export type EventType = 'practice' | 'game' | 'tournament' | 'other';

// 出欠ステータス
export type AttendanceStatus = 'yes' | 'maybe' | 'no';

// 当番割り当てステータス
export type DutyStatus = 'assigned' | 'confirmed' | 'completed';

// 交代リクエストステータス
export type SwapRequestStatus = 'pending' | 'approved' | 'rejected';

// 車両タイプ
export type VehicleType = 'personal' | 'bus';

// 乗車ステータス
export type PassengerStatus = 'assigned' | 'confirmed';

// チーム
export interface Team {
  id: string;
  name: string;
  invite_token: string;
  created_at: string;
}

// ユーザー
export interface User {
  id: string;
  team_id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

// 当番大分類
export type DutyCategoryGroupType = 'physical' | 'bench' | 'manager';

export interface DutyCategoryGroup {
  id: string;
  name: string;           // '肉体系', 'ベンチ入り', 'マネージャー業務'
  type: DutyCategoryGroupType;
  icon: string;           // 絵文字
  sort_order: number;
}

// 当番カテゴリ（小分類）
export interface DutyCategory {
  id: string;
  team_id: string;
  group_id: string;       // 大分類への参照
  group?: DutyCategoryGroup;
  name: string;
  description?: string;
  event_type: EventType;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

// メンバーのお手伝い設定
export interface MemberAvailability {
  id: string;
  user_id: string;
  // 可能な曜日
  available_saturday: boolean;
  available_sunday: boolean;
  available_holiday: boolean;
  // 可能な時間帯
  start_time: string;
  end_time: string;
  // 配車設定
  can_drive: boolean;
  car_capacity?: number;        // 乗車可能人数（運転手除く）
  can_load_equipment: boolean;  // 道具の積み込みOK
  car_model?: string;           // 車種
  car_notes?: string;           // 備考
  updated_at: string;
}

// メンバーの対応可能当番
export interface MemberDutyCapability {
  id: string;
  user_id: string;
  category_id: string;
  category?: DutyCategory;
}

// イベント
export interface Event {
  id: string;
  team_id: string;
  title: string;
  event_type: EventType;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  description?: string;
  created_by: string;
  created_at: string;
}

// イベント（リレーション付き）
export interface EventWithDetails extends Event {
  duty_assignments?: DutyAssignmentWithDetails[];
  attendance?: AttendanceWithUser[];
}

// 当番割り当て
export interface DutyAssignment {
  id: string;
  event_id: string;
  user_id: string;
  category_id: string;
  status: DutyStatus;
  created_at: string;
}

// 当番割り当て（リレーション付き）
export interface DutyAssignmentWithDetails extends DutyAssignment {
  user?: User;
  category?: DutyCategory;
  event?: Event;
}

// 出欠
export interface Attendance {
  id: string;
  event_id: string;
  user_id: string;
  status: AttendanceStatus;
  comment?: string;
  created_at: string;
  updated_at: string;
}

// 出欠（ユーザー付き）
export interface AttendanceWithUser extends Attendance {
  user?: User;
}

// 交代リクエスト
export interface SwapRequest {
  id: string;
  assignment_id: string;
  requester_id: string;
  target_user_id?: string;
  status: SwapRequestStatus;
  reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

// 交代リクエスト（リレーション付き）
export interface SwapRequestWithDetails extends SwapRequest {
  assignment?: DutyAssignmentWithDetails;
  requester?: User;
  target_user?: User;
  reviewer?: User;
}

// 通知
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message?: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}

// 配車手配
export interface VehicleArrangement {
  id: string;
  event_id: string;
  vehicle_type: VehicleType;
  driver_id?: string;       // 個人車の場合の運転者
  bus_name?: string;        // バスの場合の名称
  capacity: number;
  departure_location: string;
  departure_time: string;
  destination: string;
  notes?: string;
  created_at: string;
}

// 配車手配（リレーション付き）
export interface VehicleArrangementWithDetails extends VehicleArrangement {
  event?: Event;
  driver?: User;
  passengers?: VehiclePassengerWithUser[];
}

// 乗客割り当て
export interface VehiclePassenger {
  id: string;
  arrangement_id: string;
  user_id: string;
  status: PassengerStatus;
  created_at: string;
}

// 乗客割り当て（ユーザー付き）
export interface VehiclePassengerWithUser extends VehiclePassenger {
  user?: User;
}

// フォーム用の型
export interface CreateEventInput {
  title: string;
  event_type: EventType;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  description?: string;
}

export interface CreateDutyCategoryInput {
  name: string;
  event_type: EventType;
  color?: string;
}

export interface UpdateUserInput {
  name?: string;
  avatar_url?: string;
}

export interface CreateSwapRequestInput {
  assignment_id: string;
  target_user_id?: string;
  reason?: string;
}

// 配車手配作成用
export interface CreateVehicleArrangementInput {
  event_id: string;
  vehicle_type: VehicleType;
  driver_id?: string;
  bus_name?: string;
  capacity: number;
  departure_location: string;
  departure_time: string;
  destination: string;
  notes?: string;
}

// 乗客追加用
export interface AddPassengerInput {
  arrangement_id: string;
  user_id: string;
}

