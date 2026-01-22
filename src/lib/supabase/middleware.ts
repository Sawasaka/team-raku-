import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Supabase環境変数が未設定の場合はスキップ（開発時のモック用）
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // セッションを更新（重要）
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ページの種類を判定
  const isLoginPage = request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/register');
  const isAuthCallback = request.nextUrl.pathname.startsWith('/auth/callback');
  const isSetupPayment = request.nextUrl.pathname.startsWith('/setup-payment');
  const isPublicPage = request.nextUrl.pathname === '/';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isLegalPage = request.nextUrl.pathname.startsWith('/terms') ||
    request.nextUrl.pathname.startsWith('/privacy');
  const isPasswordPage = request.nextUrl.pathname.startsWith('/reset-password') ||
    request.nextUrl.pathname.startsWith('/update-password');

  // 未認証ユーザーの制限
  if (!user) {
    // 未認証でもアクセスできるページ
    const canAccess = isLoginPage || isAuthCallback || isPublicPage || isApiRoute || isLegalPage || isPasswordPage;
    if (!canAccess) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // 認証済みユーザーの制限
  if (user) {
    // ログイン/登録ページにアクセスしたらダッシュボードへ
    if (isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    // 決済ページ・API・コールバック以外へのアクセス時、決済状況をチェック
    if (!isSetupPayment && !isApiRoute && !isAuthCallback && !isPublicPage && !isLegalPage) {
      console.log('=== Middleware Payment Check ===');
      console.log('Path:', request.nextUrl.pathname);
      console.log('User ID:', user.id);
      
      // ユーザーの決済状況を確認
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, subscription_status')
        .eq('id', user.id)
        .single();

      console.log('User data:', userData);
      console.log('User error:', userError);

      // 管理者で決済未設定の場合は決済ページへリダイレクト
      if (userData && 
          (userData.role === 'super_admin' || userData.role === 'admin') && 
          !userData.subscription_status) {
        console.log('Redirecting to setup-payment');
        const url = request.nextUrl.clone();
        url.pathname = '/setup-payment';
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

