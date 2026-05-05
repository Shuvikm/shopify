import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ok: false, error: 'Method not allowed'}, {status: 405});
  }

  const {session, env} = context as any;

  const formData = await request.formData();
  const type = formData.get('type') as string; // 'email' | 'phone'
  const email = formData.get('email') as string | null;
  const phone = formData.get('phone') as string | null;
  const countryCode = (formData.get('countryCode') as string | null) ?? '+1';

  if (!type || (type !== 'email' && type !== 'phone')) {
    return json({ok: false, error: 'Invalid type. Must be "email" or "phone"'}, {status: 400});
  }

  if (type === 'email' && !email) {
    return json({ok: false, error: 'Email is required'}, {status: 400});
  }

  if (type === 'phone' && !phone) {
    return json({ok: false, error: 'Phone number is required'}, {status: 400});
  }

  // Generate 6-digit OTP
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const otpExpiry = String(Date.now() + 600000); // 10 minutes

  // Store OTP in session
  session.set('otp', otp);
  session.set('otpExpiry', otpExpiry);

  if (type === 'email' && email) {
    session.set('otpEmail', email);

    // Send via SendGrid
    const sendgridKey = env?.SENDGRID_API_KEY;
    if (sendgridKey) {
      try {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${sendgridKey}`,
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{email}],
              },
            ],
            from: {email: 'noreply@hydrostore.com', name: 'HydroStore'},
            subject: 'Your HydroStore verification code',
            content: [
              {
                type: 'text/html',
                value: `
                  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0a; color: #fff; border-radius: 12px;">
                    <h2 style="color: #f6c90e; margin: 0 0 16px;">HydroStore</h2>
                    <p style="margin: 0 0 24px; color: #a3a3a3;">Your verification code is:</p>
                    <div style="font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #f6c90e; text-align: center; padding: 24px; background: #1a1a1a; border-radius: 8px; margin-bottom: 24px;">
                      ${otp}
                    </div>
                    <p style="color: #737373; font-size: 13px; margin: 0;">This code expires in 10 minutes. Do not share it with anyone.</p>
                  </div>
                `,
              },
            ],
          }),
        });

        if (!response.ok) {
          const errorBody = await response.text();
          console.error('SendGrid error:', response.status, errorBody);
        }
      } catch (err) {
        console.error('Failed to send email OTP:', err);
      }
    } else {
      // Dev mode: log OTP to console
      console.log(`[DEV] OTP for ${email}: ${otp}`);
    }
  } else if (type === 'phone' && phone) {
    const fullPhone = `${countryCode}${phone}`;
    session.set('otpPhone', fullPhone);

    // Send via Twilio
    const twilioSid = env?.TWILIO_ACCOUNT_SID;
    const twilioToken = env?.TWILIO_AUTH_TOKEN;
    const twilioFrom = env?.TWILIO_FROM_PHONE;

    if (twilioSid && twilioToken && twilioFrom) {
      try {
        const credentials = btoa(`${twilioSid}:${twilioToken}`);
        const body = new URLSearchParams({
          To: fullPhone,
          From: twilioFrom,
          Body: `Your HydroStore verification code is: ${otp}. Valid for 10 minutes.`,
        });

        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `Basic ${credentials}`,
            },
            body: body.toString(),
          },
        );

        if (!response.ok) {
          const errorBody = await response.text();
          console.error('Twilio error:', response.status, errorBody);
        }
      } catch (err) {
        console.error('Failed to send SMS OTP:', err);
      }
    } else {
      // Dev mode: log OTP to console
      console.log(`[DEV] OTP for ${fullPhone}: ${otp}`);
    }
  }

  return json(
    {ok: true, method: type},
    {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    },
  );
}
