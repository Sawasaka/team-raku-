import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const inviteToken = requestUrl.searchParams.get('invite');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    // 認証コードをセッションに交換
    const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    if (user) {
      // ユーザーがusersテーブルに存在するか確認
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .single();

      // 新規ユーザーの場合、usersテーブルに追加
      if (!existingUser) {
        let teamId = null;
        let role = 'super_admin'; // デフォルトは管理者

        // 招待トークンがある場合、チームに参加
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
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '名前未設定',
          email: user.email,
          role: role,
        });

        if (userError) {
          console.error('User insert error:', userError);
        }

        // 新規管理者の場合はチーム作成ページへ
        if (!inviteToken) {
          return NextResponse.redirect(`${origin}/admin/settings?setup=true`);
        }
      }
    }
  }

  // ダッシュボードへリダイレクト
  return NextResponse.redirect(`${origin}/dashboard`);
}
