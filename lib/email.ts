import { Order, OrderItem } from '@/lib/supabase/types'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

async function sendEmail(options: EmailOptions): Promise<void> {
  const nodemailer = await import('nodemailer')

  const transporter = nodemailer.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Lanka Products" <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lanka Products</title>
</head>
<body style="margin:0;padding:0;background-color:#FFF8F0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFF8F0;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7B3F00 0%,#4A7C59 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:bold;letter-spacing:1px;">Lanka Products</h1>
              <p style="margin:8px 0 0;color:#E8C96A;font-size:14px;">From the Gardens of Ceylon</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#2C2C2C;padding:24px 40px;text-align:center;">
              <p style="margin:0;color:#999999;font-size:12px;">
                &copy; ${new Date().getFullYear()} Lanka Products. All rights reserved.<br/>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#C9A84C;text-decoration:none;">lankaproducts.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export async function sendOrderConfirmation(
  order: Order & { order_items: OrderItem[] },
  customerEmail: string
): Promise<void> {
  const itemsHtml = order.order_items
    .map(
      (item) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0e6d6;">
        <span style="color:#2C2C2C;font-size:14px;">${item.name}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f0e6d6;text-align:center;">
        <span style="color:#666;font-size:14px;">x${item.quantity}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f0e6d6;text-align:right;">
        <span style="color:#2C2C2C;font-size:14px;">$${item.total_price.toFixed(2)}</span>
      </td>
    </tr>
  `
    )
    .join('')

  const content = `
    <h2 style="color:#7B3F00;margin:0 0 8px;">Order Confirmed!</h2>
    <p style="color:#666;margin:0 0 24px;">Thank you for your order. We're preparing your authentic Sri Lankan products.</p>

    <div style="background:#FFF8F0;border-radius:6px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#666;">Order Number</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:bold;color:#7B3F00;">${order.order_number}</p>
    </div>

    <h3 style="color:#2C2C2C;margin:0 0 16px;font-size:16px;">Order Summary</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <thead>
        <tr style="border-bottom:2px solid #7B3F00;">
          <th style="padding:8px 0;text-align:left;color:#7B3F00;font-size:13px;">Item</th>
          <th style="padding:8px 0;text-align:center;color:#7B3F00;font-size:13px;">Qty</th>
          <th style="padding:8px 0;text-align:right;color:#7B3F00;font-size:13px;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <td style="color:#666;font-size:14px;padding:4px 0;">Subtotal</td>
        <td style="text-align:right;color:#2C2C2C;font-size:14px;padding:4px 0;">$${order.subtotal.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="color:#666;font-size:14px;padding:4px 0;">Shipping</td>
        <td style="text-align:right;color:#2C2C2C;font-size:14px;padding:4px 0;">$${order.shipping_cost.toFixed(2)}</td>
      </tr>
      <tr style="border-top:2px solid #7B3F00;">
        <td style="color:#7B3F00;font-size:16px;font-weight:bold;padding:8px 0 0;">Total</td>
        <td style="text-align:right;color:#7B3F00;font-size:16px;font-weight:bold;padding:8px 0 0;">$${order.total.toFixed(2)}</td>
      </tr>
    </table>

    <div style="background:#f9f5ef;border-left:4px solid #4A7C59;padding:16px;border-radius:0 6px 6px 0;margin-bottom:24px;">
      <h4 style="margin:0 0 8px;color:#2C2C2C;font-size:14px;">Shipping Address</h4>
      <p style="margin:0;color:#666;font-size:13px;line-height:1.6;">
        ${order.shipping_name}<br/>
        ${order.shipping_address_line1}${order.shipping_address_line2 ? '<br/>' + order.shipping_address_line2 : ''}<br/>
        ${order.shipping_city}${order.shipping_state ? ', ' + order.shipping_state : ''} ${order.shipping_postal_code}<br/>
        ${order.shipping_country}
      </p>
    </div>

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#7B3F00,#A0522D);color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:bold;">Track Your Order</a>
  `

  await sendEmail({
    to: customerEmail,
    subject: `Order Confirmed - ${order.order_number} | Lanka Products`,
    html: emailWrapper(content),
  })
}

export async function sendOrderStatusUpdate(
  order: Order,
  newStatus: string
): Promise<void> {
  const statusMessages: Record<string, { title: string; message: string }> = {
    confirmed: {
      title: 'Order Confirmed',
      message: 'Your order has been confirmed and is being prepared.',
    },
    processing: {
      title: 'Order Processing',
      message: 'Your order is being carefully packed with love from Sri Lanka.',
    },
    shipped: {
      title: 'Order Shipped!',
      message: 'Your authentic Sri Lankan products are on their way to you.',
    },
    delivered: {
      title: 'Order Delivered',
      message:
        'Your order has been delivered. We hope you enjoy your Sri Lankan treasures!',
    },
    cancelled: {
      title: 'Order Cancelled',
      message:
        'Your order has been cancelled. If you have questions, please contact us.',
    },
  }

  const statusInfo = statusMessages[newStatus] || {
    title: 'Order Update',
    message: `Your order status has been updated to: ${newStatus}`,
  }

  const trackingSection =
    order.tracking_number
      ? `<div style="background:#f9f5ef;border-radius:6px;padding:16px;margin:20px 0;">
      <p style="margin:0 0 4px;color:#666;font-size:13px;">Tracking Number</p>
      <p style="margin:0;color:#7B3F00;font-size:16px;font-weight:bold;">${order.tracking_number}</p>
    </div>`
      : ''

  const content = `
    <h2 style="color:#7B3F00;margin:0 0 8px;">${statusInfo.title}</h2>
    <p style="color:#666;margin:0 0 24px;">${statusInfo.message}</p>

    <div style="background:#FFF8F0;border-radius:6px;padding:20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#666;">Order Number</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:bold;color:#7B3F00;">${order.order_number}</p>
    </div>

    ${trackingSection}

    <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#7B3F00,#A0522D);color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:bold;">View Order Details</a>
  `

  await sendEmail({
    to: order.shipping_email,
    subject: `${statusInfo.title} - ${order.order_number} | Lanka Products`,
    html: emailWrapper(content),
  })
}

export async function sendWelcomeEmail(user: {
  email: string
  full_name: string | null
}): Promise<void> {
  const firstName = user.full_name?.split(' ')[0] || 'Friend'

  const content = `
    <h2 style="color:#7B3F00;margin:0 0 8px;">Welcome to Lanka Products, ${firstName}!</h2>
    <p style="color:#666;margin:0 0 20px;line-height:1.6;">
      Thank you for joining our community of people who love authentic Sri Lankan products.
      From the finest Ceylon spices to exquisite handcrafted items, we bring the island's
      treasures directly to your door.
    </p>

    <div style="background:linear-gradient(135deg,#7B3F00 0%,#4A7C59 100%);border-radius:8px;padding:24px;margin:24px 0;text-align:center;">
      <p style="margin:0 0 8px;color:#E8C96A;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Welcome Gift</p>
      <p style="margin:0 0 4px;color:#ffffff;font-size:32px;font-weight:bold;">10% OFF</p>
      <p style="margin:0 0 16px;color:#f0e6d6;font-size:14px;">Your first order</p>
      <div style="background:#C9A84C;border-radius:4px;display:inline-block;padding:8px 20px;">
        <span style="color:#2C2C2C;font-weight:bold;font-size:16px;letter-spacing:2px;">WELCOME10</span>
      </div>
    </div>

    <h3 style="color:#2C2C2C;margin:24px 0 16px;font-size:16px;">Explore Our Collections</h3>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td width="50%" style="padding-right:8px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop?category=spices" style="display:block;background:#FFF8F0;border:1px solid #f0e6d6;border-radius:6px;padding:16px;text-decoration:none;text-align:center;">
            <p style="margin:0 0 4px;font-size:24px;">🌿</p>
            <p style="margin:0;color:#7B3F00;font-weight:bold;font-size:14px;">Ceylon Spices</p>
          </a>
        </td>
        <td width="50%" style="padding-left:8px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/gift-boxes" style="display:block;background:#FFF8F0;border:1px solid #f0e6d6;border-radius:6px;padding:16px;text-decoration:none;text-align:center;">
            <p style="margin:0 0 4px;font-size:24px;">🎁</p>
            <p style="margin:0;color:#7B3F00;font-weight:bold;font-size:14px;">Gift Boxes</p>
          </a>
        </td>
      </tr>
    </table>

    <div style="margin-top:32px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/shop" style="display:inline-block;background:linear-gradient(135deg,#7B3F00,#A0522D);color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:6px;font-size:14px;font-weight:bold;">Start Shopping</a>
    </div>
  `

  await sendEmail({
    to: user.email,
    subject: 'Welcome to Lanka Products - Your Journey Begins!',
    html: emailWrapper(content),
  })
}
