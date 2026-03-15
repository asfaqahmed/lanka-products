import crypto from 'crypto'

export interface PayhereConfig {
  merchant_id: string
  return_url: string
  cancel_url: string
  notify_url: string
  order_id: string
  items: string
  amount: string
  currency: string
  first_name: string
  last_name: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  hash: string
}

export function generatePayhereHash(
  merchantId: string,
  orderId: string,
  amount: string,
  currency: string,
  merchantSecret: string
): string {
  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase()

  const hashString = `${merchantId}${orderId}${amount}${currency}${hashedSecret}`
  return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase()
}

export function buildPayhereConfig(params: {
  orderId: string
  amount: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  items: string
}): PayhereConfig {
  const merchantId = process.env.NEXT_PUBLIC_PAYHERE_MERCHANT_ID!
  const merchantSecret = process.env.PAYHERE_SECRET!
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const amountStr = params.amount.toFixed(2)
  const currency = 'USD'

  const hash = generatePayhereHash(
    merchantId,
    params.orderId,
    amountStr,
    currency,
    merchantSecret
  )

  return {
    merchant_id: merchantId,
    return_url: `${appUrl}/checkout/success`,
    cancel_url: `${appUrl}/checkout/cancel`,
    notify_url: `${appUrl}/api/payhere/notify`,
    order_id: params.orderId,
    items: params.items,
    amount: amountStr,
    currency,
    first_name: params.firstName,
    last_name: params.lastName,
    email: params.email,
    phone: params.phone,
    address: params.address,
    city: params.city,
    country: params.country,
    hash,
  }
}

export function verifyPayhereNotification(params: {
  merchant_id: string
  order_id: string
  payhere_amount: string
  payhere_currency: string
  status_code: string
  md5sig: string
}): boolean {
  const merchantSecret = process.env.PAYHERE_SECRET!

  const hashedSecret = crypto
    .createHash('md5')
    .update(merchantSecret)
    .digest('hex')
    .toUpperCase()

  const hashString = `${params.merchant_id}${params.order_id}${params.payhere_amount}${params.payhere_currency}${params.status_code}${hashedSecret}`

  const expectedSig = crypto
    .createHash('md5')
    .update(hashString)
    .digest('hex')
    .toUpperCase()

  return expectedSig === params.md5sig.toUpperCase()
}
