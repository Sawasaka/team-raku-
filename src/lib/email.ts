// メール送信ユーティリティ
// Resendを使用してメールを送信します

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = 'チーム楽 <noreply@team-raku.com>';

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set. Skipping email.');
    return { success: false, error: 'API key not configured' };
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Email send error:', error);
      return { success: false, error };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}

// メールテンプレート
export const emailTemplates = {
  // 当番割り当て通知
  dutyAssigned: ({ userName, eventTitle, eventDate, duty, eventUrl }: {
    userName: string;
    eventTitle: string;
    eventDate: string;
    duty: string;
    eventUrl: string;
  }) => ({
    subject: `【チーム楽】当番が割り当てられました: ${eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff;">
        <div style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #38bdf8, #0ea5e9); color: white; font-size: 24px; font-weight: bold; width: 48px; height: 48px; line-height: 48px; border-radius: 12px;">楽</div>
          </div>
          
          <h1 style="color: #0f172a; font-size: 20px; margin-bottom: 16px; text-align: center;">当番が割り当てられました</h1>
          
          <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
            ${userName}さん、こんにちは。<br>
            以下のイベントの当番が割り当てられました。
          </p>
          
          <div style="background-color: #f0f9ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; color: #0f172a; font-weight: 600;">${eventTitle}</p>
            <p style="margin: 0 0 4px; color: #64748b; font-size: 14px;">📅 ${eventDate}</p>
            <p style="margin: 0; color: #0ea5e9; font-size: 14px; font-weight: 500;">担当: ${duty}</p>
          </div>
          
          <a href="${eventUrl}" style="display: block; background-color: #0ea5e9; color: white; text-decoration: none; padding: 14px 24px; border-radius: 8px; text-align: center; font-weight: 500;">
            イベントを確認する
          </a>
          
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; text-align: center;">
            このメールは自動送信されています。<br>
            ご不明な点は管理者までお問い合わせください。
          </p>
        </div>
      </body>
      </html>
    `,
    text: `${userName}さん\n\n当番が割り当てられました。\n\n${eventTitle}\n日付: ${eventDate}\n担当: ${duty}\n\n詳細: ${eventUrl}`,
  }),

  // 交代リクエスト通知（管理者向け）
  swapRequestAdmin: ({ requesterName, eventTitle, eventDate, duty, reason, adminUrl }: {
    requesterName: string;
    eventTitle: string;
    eventDate: string;
    duty: string;
    reason: string;
    adminUrl: string;
  }) => ({
    subject: `【チーム楽】交代リクエストが届いています`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff;">
        <div style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #38bdf8, #0ea5e9); color: white; font-size: 24px; font-weight: bold; width: 48px; height: 48px; line-height: 48px; border-radius: 12px;">楽</div>
          </div>
          
          <h1 style="color: #0f172a; font-size: 20px; margin-bottom: 16px; text-align: center;">交代リクエストが届いています</h1>
          
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; color: #0f172a; font-weight: 600;">${requesterName}さんからの申請</p>
            <p style="margin: 0 0 4px; color: #64748b; font-size: 14px;">${eventTitle} - ${eventDate}</p>
            <p style="margin: 0 0 8px; color: #f97316; font-size: 14px; font-weight: 500;">担当: ${duty}</p>
            <p style="margin: 0; color: #64748b; font-size: 14px;">理由: ${reason}</p>
          </div>
          
          <a href="${adminUrl}" style="display: block; background-color: #0ea5e9; color: white; text-decoration: none; padding: 14px 24px; border-radius: 8px; text-align: center; font-weight: 500;">
            リクエストを確認する
          </a>
        </div>
      </body>
      </html>
    `,
    text: `交代リクエストが届いています。\n\n申請者: ${requesterName}\n${eventTitle} - ${eventDate}\n担当: ${duty}\n理由: ${reason}\n\n確認: ${adminUrl}`,
  }),

  // 交代リクエスト結果通知
  swapRequestResult: ({ userName, eventTitle, duty, approved, eventUrl }: {
    userName: string;
    eventTitle: string;
    duty: string;
    approved: boolean;
    eventUrl: string;
  }) => ({
    subject: `【チーム楽】交代リクエストが${approved ? '承認' : '却下'}されました`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff;">
        <div style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #38bdf8, #0ea5e9); color: white; font-size: 24px; font-weight: bold; width: 48px; height: 48px; line-height: 48px; border-radius: 12px;">楽</div>
          </div>
          
          <h1 style="color: #0f172a; font-size: 20px; margin-bottom: 16px; text-align: center;">
            交代リクエストが${approved ? '承認' : '却下'}されました
          </h1>
          
          <div style="background-color: ${approved ? '#dcfce7' : '#fee2e2'}; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0; color: ${approved ? '#166534' : '#dc2626'}; font-size: 24px;">
              ${approved ? '✓ 承認' : '✗ 却下'}
            </p>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
            ${userName}さん<br><br>
            ${eventTitle}の「${duty}」の交代リクエストが${approved ? '承認' : '却下'}されました。
            ${approved ? '当番は他の方に引き継がれました。' : '予定通り当番をお願いします。'}
          </p>
          
          <a href="${eventUrl}" style="display: block; background-color: #0ea5e9; color: white; text-decoration: none; padding: 14px 24px; border-radius: 8px; text-align: center; font-weight: 500;">
            イベントを確認する
          </a>
        </div>
      </body>
      </html>
    `,
    text: `${userName}さん\n\n${eventTitle}の「${duty}」の交代リクエストが${approved ? '承認' : '却下'}されました。\n\n確認: ${eventUrl}`,
  }),

  // リマインダー通知
  reminder: ({ userName, eventTitle, eventDate, duty, eventUrl }: {
    userName: string;
    eventTitle: string;
    eventDate: string;
    duty: string;
    eventUrl: string;
  }) => ({
    subject: `【チーム楽】明日は当番です: ${eventTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f9ff;">
        <div style="background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #38bdf8, #0ea5e9); color: white; font-size: 24px; font-weight: bold; width: 48px; height: 48px; line-height: 48px; border-radius: 12px;">楽</div>
          </div>
          
          <h1 style="color: #0f172a; font-size: 20px; margin-bottom: 16px; text-align: center;">🔔 明日は当番です</h1>
          
          <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">
            ${userName}さん、明日のイベントのお知らせです。
          </p>
          
          <div style="background-color: #fef3c7; border-left: 4px solid #f97316; border-radius: 0 8px 8px 0; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; color: #0f172a; font-weight: 600; font-size: 16px;">${eventTitle}</p>
            <p style="margin: 0 0 4px; color: #64748b; font-size: 14px;">📅 ${eventDate}</p>
            <p style="margin: 0; color: #f97316; font-size: 14px; font-weight: 500;">担当: ${duty}</p>
          </div>
          
          <a href="${eventUrl}" style="display: block; background-color: #0ea5e9; color: white; text-decoration: none; padding: 14px 24px; border-radius: 8px; text-align: center; font-weight: 500;">
            詳細を確認する
          </a>
        </div>
      </body>
      </html>
    `,
    text: `${userName}さん\n\n明日は当番です。\n\n${eventTitle}\n日付: ${eventDate}\n担当: ${duty}\n\n詳細: ${eventUrl}`,
  }),
};





