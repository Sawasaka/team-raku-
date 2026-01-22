import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const token_hash = requestUrl.searchParams.get('token_hash');
  const type = requestUrl.searchParams.get('type');
  const inviteToken = requestUrl.searchParams.get('invite');
  const origin = requestUrl.origin;

  console.log('=== Auth Callback Start ===');
  console.log('Code:', code ? 'exists' : 'missing');
  console.log('Token Hash:', token_hash ? 'exists' : 'missing');
  console.log('Type:', type);
  console.log('InviteToken:', inviteToken);

  const supabase = await createClient();

  // パスワードリセットの場合
  if (type === 'recovery' && token_hash) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'recovery',
    });

    if (error) {
      console.error('Recovery verification error:', error);
      return NextResponse.redirect(`${origin}/login?error=invalid_token`);
    }

    // パスワード更新ページへリダイレクト
    return NextResponse.redirect(`${origin}/update-password`);
  }

  // メール確認（signup）の場合
  if (type === 'signup' && token_hash) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: 'signup',
    });

    if (error) {
      console.error('Signup verification error:', error);
      return NextResponse.redirect(`${origin}/login?error=invalid_token`);
    }

    const user = data.user;

    if (user) {
      console.log('User verified:', user.id, user.email);
      
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
        
        const metadata = user.user_metadata || {};
        let teamId = metadata.team_id || null;
        let role = metadata.role || 'super_admin';

        if (inviteToken) {
          const { data: team } = await supabase
            .from('teams')
            .select('id')
            .eq('invite_token', inviteToken)
            .single();

          if (team) {
            teamId = team.id;
            role = 'member';
          }
        }

        const { error: userError } = await supabase.from('users').insert({
          id: user.id,
          team_id: teamId,
          name: metadata.name || metadata.full_name || user.email?.split('@')[0] || '名前未設定',
          email: user.email,
          role: role,
        });

        console.log('User insert result:', { userError });

        if (!inviteToken) {
          console.log('Redirecting to setup-payment (new admin)');
          return NextResponse.redirect(`${origin}/setup-payment`);
        }
      } else {
        console.log('Existing user found');
        if (!inviteToken && !existingUser.subscription_status) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (userData?.role === 'super_admin' || userData?.role === 'admin') {
            console.log('Redirecting to setup-payment (existing admin without subscription)');
            return NextResponse.redirect(`${origin}/setup-payment`);
          }
        }
      }
    }

    return NextResponse.redirect(`${origin}/dashboard`);
  }

  // OAuth（Googleなど）のコールバック
  if (code) {
    const { data: { user }, error: authError } = await supabase.auth.exchangeCodeForSession(code);

    console.log('Auth exchange result:', { user: user?.id, authError });

    if (authError) {
      console.error('Auth error:', authError);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    if (user) {
      console.log('User authenticated:', user.id, user.email);
      
      const { data: existingUser, error: selectError } = await supabase
        .from('users')
        .select('id, subscription_status')
        .eq('id', user.id)
        .single();

      console.log('Existing user check:', { existingUser, selectError });

      if (!existingUser) {
        console.log('New user - will insert');
        
        const metadata = user.user_metadata || {};
        let teamId = metadata.team_id || null;
        let role = metadata.role || 'super_admin';

        if (inviteToken) {
          const { data: team } = await supabase
            .from('teams')
            .select('id')
            .eq('invite_token', inviteToken)
            .single();

          if (team) {
            teamId = team.id;
            role = 'member';
          }
        }

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

        if (!inviteToken) {
          console.log('Redirecting to setup-payment (new admin)');
          return NextResponse.redirect(`${origin}/setup-payment`);
        }
      } else {
        console.log('Existing user found');
        if (!inviteToken && !existingUser.subscription_status) {
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
  return NextResponse.redirect(`${origin}/dashboard`);
}
