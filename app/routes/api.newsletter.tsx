import {json, type ActionFunctionArgs} from '@remix-run/server-runtime';

export async function action({request, context}: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ok: false, error: 'Method not allowed'}, {status: 405});
  }

  const {env} = context as any;
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ok: false, error: 'Please enter a valid email address.'}, {status: 400});
  }

  const sendgridKey = env?.SENDGRID_API_KEY;

  if (sendgridKey) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sendgridKey}`,
        },
        body: JSON.stringify({
          personalizations: [{to: [{email}]}],
          from: {email: 'noreply@hydrostore.com', name: 'HydroStore'},
          subject: 'Welcome to the Inner Circle — HydroStore',
          content: [
            {
              type: 'text/html',
              value: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9f6f0;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f6f0;padding:48px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border:1px solid #e8e0d4;max-width:560px;width:100%;">
        <tr>
          <td style="padding:56px 56px 0;text-align:center;border-bottom:1px solid #f0ede8;">
            <p style="margin:0 0 32px;font-size:9px;letter-spacing:6px;text-transform:uppercase;color:#c9a84c;">Exclusive Membership</p>
            <h1 style="margin:0 0 24px;font-size:36px;font-weight:400;color:#1a1a2e;line-height:1.2;">Welcome to the<br>Inner Circle</h1>
            <div style="width:40px;height:1px;background:#c9a84c;margin:0 auto 32px;"></div>
            <p style="margin:0 0 48px;font-size:15px;color:#737373;line-height:1.8;font-weight:300;">
              You now have access to private collections, early releases, and invitations reserved exclusively for our most discerning members.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:48px 56px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:24px;background:#f9f6f0;border-left:2px solid #c9a84c;">
                  <p style="margin:0 0 8px;font-size:9px;letter-spacing:4px;text-transform:uppercase;color:#c9a84c;">What to Expect</p>
                  <p style="margin:0;font-size:13px;color:#555;line-height:1.8;font-weight:300;">
                    First access to new collections &nbsp;·&nbsp; Members-only pricing &nbsp;·&nbsp; Private sale invitations &nbsp;·&nbsp; Curated editorial content
                  </p>
                </td>
              </tr>
            </table>

            <div style="margin:40px 0;text-align:center;">
              <a href="https://hydrostore.com/collections/all" style="display:inline-block;padding:18px 48px;background:#1a1a2e;color:#fff;text-decoration:none;font-size:9px;letter-spacing:4px;text-transform:uppercase;">
                Explore the Archive
              </a>
            </div>

            <p style="margin:0;font-size:11px;color:#aaa;text-align:center;line-height:1.8;">
              You are receiving this because you subscribed at HydroStore.<br>
              <a href="#" style="color:#aaa;">Unsubscribe</a>
            </p>
          </td>
        </tr>
      </table>
      <p style="margin:24px 0 0;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#bbb;">
        &copy; 2026 HydroStore &nbsp;·&nbsp; Crafted with intention
      </p>
    </td></tr>
  </table>
</body>
</html>`,
            },
          ],
        }),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => '');
        console.error('SendGrid newsletter error:', res.status, body);
      }
    } catch (err) {
      console.error('Newsletter email send failed:', err);
    }
  } else {
    console.log(`[DEV] Newsletter subscription from: ${email}`);
  }

  return json({ok: true});
}
