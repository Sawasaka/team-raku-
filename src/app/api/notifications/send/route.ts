import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let emailContent;
    
    switch (type) {
      case 'duty_assigned':
        emailContent = emailTemplates.dutyAssigned(data);
        break;
      case 'swap_request_admin':
        emailContent = emailTemplates.swapRequestAdmin(data);
        break;
      case 'swap_request_result':
        emailContent = emailTemplates.swapRequestResult(data);
        break;
      case 'reminder':
        emailContent = emailTemplates.reminder(data);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        );
    }

    const result = await sendEmail({
      to: data.email || data.to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}





