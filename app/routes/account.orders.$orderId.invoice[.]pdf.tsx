import type {LoaderFunctionArgs} from '@remix-run/server-runtime';
import {createInvoicePdf} from '~/lib/invoice-pdf.server';
import {getStoredOrder} from '~/lib/orders.server';

export async function loader({params, context}: LoaderFunctionArgs) {
  const order = getStoredOrder(context.session, params.orderId);
  if (!order) throw new Response('Order not found', {status: 404});

  const pdf = createInvoicePdf(order);
  const body = pdf.buffer.slice(pdf.byteOffset, pdf.byteOffset + pdf.byteLength) as ArrayBuffer;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${order.orderNumber}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
