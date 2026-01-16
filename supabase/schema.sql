-- チーム楽 データベーススキーマ
-- Supabase SQL Editorで実行してください

-- UUID拡張を有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- チームテーブル
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  invite_token VARCHAR(50) UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ユーザーテーブル
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('super_admin', 'admin', 'member')),
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 当番カテゴリテーブル
CREATE TABLE IF NOT EXISTS duty_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('practice', 'game', 'other')),
  color VARCHAR(7) DEFAULT '#0ea5e9',
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- イベントテーブル
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('practice', 'game', 'other')),
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location VARCHAR(200),
  description TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 当番割り当てテーブル
CREATE TABLE IF NOT EXISTS duty_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES duty_categories(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'confirmed', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id, category_id)
);

-- 出欠テーブル
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(10) NOT NULL CHECK (status IN ('yes', 'maybe', 'no')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- 交代リクエストテーブル
CREATE TABLE IF NOT EXISTS swap_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID REFERENCES duty_assignments(id) ON DELETE CASCADE,
  requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_user_id UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reason TEXT,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 通知テーブル
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  link VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_users_team_id ON users(team_id);
CREATE INDEX IF NOT EXISTS idx_events_team_id ON events(team_id);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_duty_assignments_event_id ON duty_assignments(event_id);
CREATE INDEX IF NOT EXISTS idx_duty_assignments_user_id ON duty_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_event_id ON attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_user_id ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Row Level Security (RLS) ポリシー

-- teams テーブルのRLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their team" ON teams
  FOR SELECT
  USING (id IN (SELECT team_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Super admins can insert teams" ON teams
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Super admins can update their team" ON teams
  FOR UPDATE
  USING (id IN (SELECT team_id FROM users WHERE id = auth.uid() AND role = 'super_admin'));

-- users テーブルのRLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view team members" ON users
  FOR SELECT
  USING (team_id IN (SELECT team_id FROM users WHERE id = auth.uid()) OR id = auth.uid());

CREATE POLICY "Users can insert their own record" ON users
  FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own record" ON users
  FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admins can update team members" ON users
  FOR UPDATE
  USING (
    team_id IN (
      SELECT team_id FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- duty_categories テーブルのRLS
ALTER TABLE duty_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their team categories" ON duty_categories
  FOR SELECT
  USING (team_id IN (SELECT team_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage categories" ON duty_categories
  FOR ALL
  USING (
    team_id IN (
      SELECT team_id FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- events テーブルのRLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their team events" ON events
  FOR SELECT
  USING (team_id IN (SELECT team_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage events" ON events
  FOR ALL
  USING (
    team_id IN (
      SELECT team_id FROM users 
      WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- duty_assignments テーブルのRLS
ALTER TABLE duty_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view assignments for their team events" ON duty_assignments
  FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM events 
      WHERE team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Admins can manage assignments" ON duty_assignments
  FOR ALL
  USING (
    event_id IN (
      SELECT e.id FROM events e
      JOIN users u ON e.team_id = u.team_id
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin')
    )
  );

-- attendance テーブルのRLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attendance for their team events" ON attendance
  FOR SELECT
  USING (
    event_id IN (
      SELECT id FROM events 
      WHERE team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can manage their own attendance" ON attendance
  FOR ALL
  USING (user_id = auth.uid());

-- swap_requests テーブルのRLS
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view swap requests for their team" ON swap_requests
  FOR SELECT
  USING (
    assignment_id IN (
      SELECT da.id FROM duty_assignments da
      JOIN events e ON da.event_id = e.id
      WHERE e.team_id IN (SELECT team_id FROM users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can create their own swap requests" ON swap_requests
  FOR INSERT
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Admins can manage swap requests" ON swap_requests
  FOR UPDATE
  USING (
    assignment_id IN (
      SELECT da.id FROM duty_assignments da
      JOIN events e ON da.event_id = e.id
      JOIN users u ON e.team_id = u.team_id
      WHERE u.id = auth.uid() AND u.role IN ('admin', 'super_admin')
    )
  );

-- notifications テーブルのRLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT
  WITH CHECK (true);

-- 更新時のタイムスタンプ自動更新
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();





