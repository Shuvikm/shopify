import type {StoredOrder} from './orders.server';

interface NotificationEnv {
  SENDGRID_API_KEY?: string;
  ORDER_FROM_EMAIL?: string;
  TWILIO_ACCOUNT_SID?: string;
  TWILIO_AUTH_TOKEN?: string;
  TWILIO_FROM_PHONE?: string;
  RUFLOW_ORDER_WEBHOOK_URL?: string;
}

function authHeader(accountSid: string, authToken: string): string {
  return `Basic ${btoa(`${accountSid}:${authToken}`)}`;
}

async function sendEmail(env: NotificationEnv, order: StoredOrder): Promise<void> {
  if (!env.SENDGRID_API_KEY || !env.ORDER_FROM_EMAIL || !order.customer.email) return;

  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{to: [{email: order.customer.email}]}],
      from: {email: env.ORDER_FROM_EMAIL, name: 'HydroStore'},
      subject: `Order ${order.orderNumber} confirmed`,
      content: [
        {
          type: 'text/plain',
          value: `Thanks for your order ${order.orderNumber}. Total paid: ${order.totals.currencyCode} ${order.totals.total.toFixed(2)}. Track it from your HydroStore account.`,
        },
      ],
    }),
  }).then((response) => {
    if (!response.ok) throw new Error(`SendGrid failed with ${response.status}`);
  });
}

async function sendSms(env: NotificationEnv, order: StoredOrder): Promise<void> {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN || !env.TWILIO_FROM_PHONE || !order.customer.phone) return;

  const params = new URLSearchParams({
    To: order.customer.phone,
    From: env.TWILIO_FROM_PHONE,
    Body: `HydroStore order ${order.orderNumber} is confirmed. Estimated delivery: ${order.tracking.estimatedDelivery}.`,
  });

  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: authHeader(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  }).then((response) => {
    if (!response.ok) throw new Error(`Twilio failed with ${response.status}`);
  });
}

async function sendWorkflow(env: NotificationEnv, order: StoredOrder): Promise<void> {
  if (!env.RUFLOW_ORDER_WEBHOOK_URL) return;

  await fetch(env.RUFLOW_ORDER_WEBHOOK_URL, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({event: 'order.confirmed', order}),
  }).then((response) => {
    if (!response.ok) throw new Error(`Ruflow failed with ${response.status}`);
  });
}

export async function sendOrderNotifications(env: NotificationEnv, order: StoredOrder): Promise<void> {
  const results = await Promise.allSettled([
    sendEmail(env, order),
    sendSms(env, order),
    sendWorkflow(env, order),
  ]);

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('Order notification failed:', result.reason);
    }
  }
}
