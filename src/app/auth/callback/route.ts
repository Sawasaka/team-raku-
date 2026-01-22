import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const inviteToken = requestUrl.searchParams.get('invite');
  const origin = requestUrl.origin;

  console.log('=== Auth Callback Start ===');
  console.log('Code:', code ? 'exists' : 'missing');
  console.log('InviteToken:', inviteToken);

  if (code) {
    const supabase = await createClient();
    
    // 認証コードをセッションに交換
    const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    console.log('Auth exchange result:', { user: user?.id, authError });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    if (user) {
      console.log('User authenticated:', user.id, user.email);
      
      // ユーザーがusersテーブルに存在するか確認
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('id, subscription_status')
        .eq('id', user.id)
        .single();

      console.log('Existing user check:', { existingUser, selectError });

      // 新規ユーザーの場合、usersテーブルに追加
      if (!existingUser) {
        console.log('New user - will insert');
        
        // metadataから登録時の情報を取得
        const metadata = user.user_metadata || {};
        let teamId = metadata.team_id || null;
        let role = metadata.role || 'super_admin'; // デフォルトは管理者

        // 招待トークンがある場合、チームに参加（metadataより優先）
        if (inviteToken) {
          const { data: team } = await supabase
            .from('teams')
            .select('id')
            .eq('invite_token', inviteToken)
            .single();

          if (team) {
            teamId = team.id;
            role = 'member'; // 招待経由はメンバー
          }
        }

        // ユーザー情報を保存
        const { error: userError } = await supabase.from('users').insert({
          id: user.id,
          team_id: teamId,
          name: metadata.name || metadata.full_name || user.email?.split('@')[0] || '名前未設定',
          email: user.email,
          role: role,
        });

        console.log('User insert result:', { userError });

        if (userError) {
          console.error('User insert error:', userError);
        }

        // 新規管理者の場合は決済設定ページへ（招待メンバーは不要）
        if (!inviteToken) {
          console.log('Redirecting to setup-payment (new admin)');
          return NextResponse.redirect(`${origin}/setup-payment`);
        }
      } else {
        console.log('Existing user found');
        // 既存ユーザー: 管理者で決済未設定の場合は決済ページへ
        if (!inviteToken && !existingUser.subscription_status) {
          // Check if user is admin
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          console.log('User role check:', userData?.role);

          if (userData?.role === 'super_admin' || userData?.role === 'admin') {
            console.log('Redirecting to setup-payment (existing admin without subscription)');
            return NextResponse.redirect(`${origin}/setup-payment`);
          }
        }
      }
    }
  }

  console.log('Redirecting to dashboard (fallback)');
  // ダッシュボードへリダイレクト
  return NextResponse.redirect(`${origin}/dashboard`);
}
