// 配車機能のモックデータ

import { 
  User, 
  Event, 
  VehicleArrangementWithDetails,
  VehiclePassengerWithUser,
  DutyCategoryGroup,
  DutyCategory,
  MemberAvailability,
  MemberDutyCapability
} from '@/types';

// 当番大分類
export const mockDutyCategoryGroups: DutyCategoryGroup[] = [
  {
    id: 'group-1',
    name: '肉体系',
    type: 'physical',
    icon: '💪',
    sort_order: 1,
  },
  {
    id: 'group-2',
    name: 'ベンチ入り（試合時）',
    type: 'bench',
    icon: '📋',
    sort_order: 2,
  },
  {
    id: 'group-3',
    name: 'マネージャー業務',
    type: 'manager',
    icon: '☕',
    sort_order: 3,
  },
];

// 当番小分類
export const mockDutyCategories: DutyCategory[] = [
  // 肉体系
  {
    id: 'cat-1',
    team_id: 'team-1',
    group_id: 'group-1',
    group: mockDutyCategoryGroups[0],
    name: '整備・道具運搬',
    description: 'ライン引き・整地・ネット張り・備品運搬など',
    event_type: 'practice',
    color: 'blue',
    sort_order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-2',
    team_id: 'team-1',
    group_id: 'group-1',
    group: mockDutyCategoryGroups[0],
    name: '審判',
    description: '塁審・球審など',
    event_type: 'game',
    color: 'blue',
    sort_order: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  // ベンチ入り
  {
    id: 'cat-4',
    team_id: 'team-1',
    group_id: 'group-2',
    group: mockDutyCategoryGroups[1],
    name: '記録係',
    description: 'スコアブック記入',
    event_type: 'game',
    color: 'green',
    sort_order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-5',
    team_id: 'team-1',
    group_id: 'group-2',
    group: mockDutyCategoryGroups[1],
    name: 'アナウンス',
    description: '試合のアナウンス担当',
    event_type: 'game',
    color: 'green',
    sort_order: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  // マネージャー業務（2つのみ）
  {
    id: 'cat-6',
    team_id: 'team-1',
    group_id: 'group-3',
    group: mockDutyCategoryGroups[2],
    name: '雑務・お手伝い',
    description: 'お茶当番・炊き出し・買い出しなど',
    event_type: 'practice',
    color: 'amber',
    sort_order: 1,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-7',
    team_id: 'team-1',
    group_id: 'group-3',
    group: mockDutyCategoryGroups[2],
    name: '練習補助',
    description: '球出し・ノック・キャッチャーなど',
    event_type: 'practice',
    color: 'amber',
    sort_order: 2,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
  },
];

// メンバーのお手伝い設定
export const mockMemberAvailability: MemberAvailability[] = [
  {
    id: 'avail-1',
    user_id: 'user-1',
    available_saturday: true,
    available_sunday: true,
    available_holiday: true,
    start_time: '08:00',
    end_time: '18:00',
    can_drive: true,
    car_capacity: 3,
    can_load_equipment: true,
    car_model: 'アルファード',
    car_notes: '',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-2',
    user_id: 'user-2',
    available_saturday: true,
    available_sunday: false,
    available_holiday: true,
    start_time: '09:00',
    end_time: '15:00',
    can_drive: true,
    car_capacity: 2,
    can_load_equipment: false,
    car_model: 'フィット',
    car_notes: 'トランク小さめ',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'avail-3',
    user_id: 'user-3',
    available_saturday: true,
    available_sunday: true,
    available_holiday: false,
    start_time: '08:00',
    end_time: '17:00',
    can_drive: false,
    can_load_equipment: false,
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// メンバーの対応可能当番
export const mockMemberDutyCapabilities: MemberDutyCapability[] = [
  // user-1: 肉体系全般 + マネージャー業務
  { id: 'cap-1', user_id: 'user-1', category_id: 'cat-1', category: mockDutyCategories[0] },
  { id: 'cap-2', user_id: 'user-1', category_id: 'cat-2', category: mockDutyCategories[1] },
  { id: 'cap-4', user_id: 'user-1', category_id: 'cat-6', category: mockDutyCategories[4] },
  // user-2: ベンチ入り + マネージャー業務
  { id: 'cap-5', user_id: 'user-2', category_id: 'cat-4', category: mockDutyCategories[2] },
  { id: 'cap-6', user_id: 'user-2', category_id: 'cat-5', category: mockDutyCategories[3] },
  { id: 'cap-7', user_id: 'user-2', category_id: 'cat-6', category: mockDutyCategories[4] },
  // user-3: 整備・道具運搬 + 練習補助
  { id: 'cap-8', user_id: 'user-3', category_id: 'cat-1', category: mockDutyCategories[0] },
  { id: 'cap-9', user_id: 'user-3', category_id: 'cat-7', category: mockDutyCategories[5] },
];

// ユーザーIDからお手伝い設定を取得
export const getMemberAvailabilityByUserId = (userId: string): MemberAvailability | undefined => {
  return mockMemberAvailability.find(a => a.user_id === userId);
};

// ユーザーIDから対応可能当番を取得
export const getMemberCapabilitiesByUserId = (userId: string): MemberDutyCapability[] => {
  return mockMemberDutyCapabilities.filter(c => c.user_id === userId);
};

// 特定の当番カテゴリに対応可能なメンバーを取得
export const getMembersCapableOfDuty = (categoryId: string): User[] => {
  const userIds = mockMemberDutyCapabilities
    .filter(c => c.category_id === categoryId)
    .map(c => c.user_id);
  return mockUsers.filter(u => userIds.includes(u.id));
};

// モックユーザー
export const mockUsers: User[] = [
  {
    id: 'user-1',
    team_id: 'team-1',
    name: '田中 太郎',
    email: 'tanaka@example.com',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-2',
    team_id: 'team-1',
    name: '山田 花子',
    email: 'yamada@example.com',
    role: 'member',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-3',
    team_id: 'team-1',
    name: '佐藤 次郎',
    email: 'sato@example.com',
    role: 'member',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-4',
    team_id: 'team-1',
    name: '鈴木 三郎',
    email: 'suzuki@example.com',
    role: 'member',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-5',
    team_id: 'team-1',
    name: '高橋 四郎',
    email: 'takahashi@example.com',
    role: 'member',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-6',
    team_id: 'team-1',
    name: '伊藤 五郎',
    email: 'ito@example.com',
    role: 'member',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-7',
    team_id: 'team-1',
    name: '渡辺 六郎',
    email: 'watanabe@example.com',
    role: 'member',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'user-8',
    team_id: 'team-1',
    name: '中村 七郎',
    email: 'nakamura@example.com',
    role: 'member',
    created_at: '2024-01-01T00:00:00Z',
  },
];

// モックイベント
export const mockEvents: Event[] = [
  {
    id: 'event-1',
    team_id: 'team-1',
    title: '12月28日 練習',
    event_type: 'practice',
    event_date: '2024-12-28',
    start_time: '09:00',
    end_time: '12:00',
    location: '〇〇グラウンド',
    created_by: 'user-1',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'event-2',
    team_id: 'team-1',
    title: '1月5日 練習試合',
    event_type: 'game',
    event_date: '2025-01-05',
    start_time: '08:30',
    end_time: '17:00',
    location: '△△球場',
    created_by: 'user-1',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'event-3',
    team_id: 'team-1',
    title: '1月12日 練習',
    event_type: 'practice',
    event_date: '2025-01-12',
    start_time: '09:00',
    end_time: '12:00',
    location: '〇〇グラウンド',
    created_by: 'user-1',
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'event-4',
    team_id: 'team-1',
    title: '1月19日 公式戦',
    event_type: 'game',
    event_date: '2025-01-19',
    start_time: '10:00',
    end_time: '18:00',
    location: '□□スタジアム',
    created_by: 'user-1',
    created_at: '2024-01-01T00:00:00Z',
  },
];

// ユーザーIDからユーザーを取得
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

// イベントIDからイベントを取得
export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

// 配車手配のモックデータ
export const mockVehicleArrangements: VehicleArrangementWithDetails[] = [
  // イベント2（1月5日 練習試合）の配車
  {
    id: 'vehicle-1',
    event_id: 'event-2',
    vehicle_type: 'personal',
    driver_id: 'user-1',
    capacity: 4,
    departure_location: 'グラウンド前駐車場',
    departure_time: '08:00',
    destination: '△△球場',
    notes: '高速道路使用',
    created_at: '2024-01-01T00:00:00Z',
    event: mockEvents[1],
    driver: mockUsers[0],
    passengers: [
      {
        id: 'passenger-1',
        arrangement_id: 'vehicle-1',
        user_id: 'user-2',
        status: 'confirmed',
        created_at: '2024-01-01T00:00:00Z',
        user: mockUsers[1],
      },
      {
        id: 'passenger-2',
        arrangement_id: 'vehicle-1',
        user_id: 'user-3',
        status: 'assigned',
        created_at: '2024-01-01T00:00:00Z',
        user: mockUsers[2],
      },
    ],
  },
  {
    id: 'vehicle-2',
    event_id: 'event-2',
    vehicle_type: 'bus',
    bus_name: 'チームバス',
    capacity: 20,
    departure_location: '駅前ロータリー',
    departure_time: '07:30',
    destination: '△△球場',
    notes: '集合時間厳守でお願いします',
    created_at: '2024-01-01T00:00:00Z',
    event: mockEvents[1],
    passengers: [
      {
        id: 'passenger-3',
        arrangement_id: 'vehicle-2',
        user_id: 'user-4',
        status: 'confirmed',
        created_at: '2024-01-01T00:00:00Z',
        user: mockUsers[3],
      },
      {
        id: 'passenger-4',
        arrangement_id: 'vehicle-2',
        user_id: 'user-5',
        status: 'confirmed',
        created_at: '2024-01-01T00:00:00Z',
        user: mockUsers[4],
      },
      {
        id: 'passenger-5',
        arrangement_id: 'vehicle-2',
        user_id: 'user-6',
        status: 'assigned',
        created_at: '2024-01-01T00:00:00Z',
        user: mockUsers[5],
      },
      {
        id: 'passenger-6',
        arrangement_id: 'vehicle-2',
        user_id: 'user-7',
        status: 'assigned',
        created_at: '2024-01-01T00:00:00Z',
        user: mockUsers[6],
      },
    ],
  },
  // イベント4（1月19日 公式戦）の配車
  {
    id: 'vehicle-3',
    event_id: 'event-4',
    vehicle_type: 'personal',
    driver_id: 'user-2',
    capacity: 5,
    departure_location: '〇〇グラウンド',
    departure_time: '09:00',
    destination: '□□スタジアム',
    created_at: '2024-01-01T00:00:00Z',
    event: mockEvents[3],
    driver: mockUsers[1],
    passengers: [],
  },
  {
    id: 'vehicle-4',
    event_id: 'event-4',
    vehicle_type: 'bus',
    bus_name: '大型バス（レンタル）',
    capacity: 40,
    departure_location: '駅前ロータリー',
    departure_time: '08:30',
    destination: '□□スタジアム',
    notes: '公式戦のため早めに出発します',
    created_at: '2024-01-01T00:00:00Z',
    event: mockEvents[3],
    passengers: [],
  },
];

// イベントIDから配車手配を取得
export const getVehicleArrangementsByEventId = (eventId: string): VehicleArrangementWithDetails[] => {
  return mockVehicleArrangements.filter(arrangement => arrangement.event_id === eventId);
};

// ユーザーIDから配車予定を取得（自分が乗車する配車）
export const getVehicleArrangementsByPassengerId = (userId: string): VehicleArrangementWithDetails[] => {
  return mockVehicleArrangements.filter(arrangement => 
    arrangement.passengers?.some(passenger => passenger.user_id === userId)
  );
};

// ユーザーIDから運転する配車を取得
export const getVehicleArrangementsByDriverId = (userId: string): VehicleArrangementWithDetails[] => {
  return mockVehicleArrangements.filter(arrangement => 
    arrangement.vehicle_type === 'personal' && arrangement.driver_id === userId
  );
};

// イベント別の配車サマリー
export interface EventVehicleSummary {
  event: Event;
  totalVehicles: number;
  totalCapacity: number;
  totalPassengers: number;
  arrangements: VehicleArrangementWithDetails[];
}

export const getEventVehicleSummaries = (): EventVehicleSummary[] => {
  const eventMap = new Map<string, EventVehicleSummary>();

  mockVehicleArrangements.forEach(arrangement => {
    const eventId = arrangement.event_id;
    const event = arrangement.event || getEventById(eventId);
    
    if (!event) return;

    if (!eventMap.has(eventId)) {
      eventMap.set(eventId, {
        event,
        totalVehicles: 0,
        totalCapacity: 0,
        totalPassengers: 0,
        arrangements: [],
      });
    }

    const summary = eventMap.get(eventId)!;
    summary.totalVehicles += 1;
    summary.totalCapacity += arrangement.capacity;
    summary.totalPassengers += arrangement.passengers?.length || 0;
    summary.arrangements.push(arrangement);
  });

  return Array.from(eventMap.values()).sort(
    (a, b) => new Date(a.event.event_date).getTime() - new Date(b.event.event_date).getTime()
  );
};

