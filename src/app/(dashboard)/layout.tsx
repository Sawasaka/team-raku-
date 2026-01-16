import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// TODO: 実際の認証実装後にサーバーサイドでユーザー情報を取得
const mockUser = {
  name: 'テストユーザー',
  email: 'test@example.com',
  role: 'super_admin', // スーパー管理者でテスト
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      <Header user={mockUser} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

