import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// TODO: 実際の認証実装後にサーバーサイドでユーザー情報を取得
const mockUser = {
  name: '管理者ユーザー',
  email: 'admin@example.com',
  role: 'super_admin', // スーパー管理者でテスト（メンバー管理が表示される）
};

export default function AdminLayout({
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

