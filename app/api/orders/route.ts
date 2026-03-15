import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { buildPayhereConfig } from '@/lib/payhere'
import { sendOrderConfirmation } from '@/lib/email'

// Use untyped client for mutations — Supabase JS v2 generic inference
// incorrectly narrows insert/update params to `never` in some TS configs
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const orderItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  type: z.enum(['product', 'gift_box']),
})

const shippingAddressSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  postalCode: z.string().min(3),
  country: z.string().min(2),
  countryCode: z.string().length(2),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shippingAddress: shippingAddressSchema,
  subtotal: z.number().positive(),
  shippingCost: z.number().min(0),
  total: z.number().positive(),
  notes: z.string().optional(),
})

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `LP-${date}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const validation = createOrderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { items, shippingAddress, subtotal, shippingCost, total, notes } = validation.data

    // Get authenticated user (optional)
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const { data: { user } } = await supabase.auth.getUser(token)
      userId = user?.id || null
    }

    // Generate order number
    const orderNumber = generateOrderNumber()

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId,
        status: 'pending',
        payment_status: 'pending',
        subtotal,
        shipping_cost: shippingCost,
        total,
        currency: 'USD',
        shipping_name: shippingAddress.name,
        shipping_email: shippingAddress.email,
        shipping_phone: shippingAddress.phone,
        shipping_address_line1: shippingAddress.addressLine1,
        shipping_address_line2: shippingAddress.addressLine2 || null,
        shipping_city: shippingAddress.city,
        shipping_state: shippingAddress.state || null,
        shipping_postal_code: shippingAddress.postalCode,
        shipping_country: shippingAddress.country,
        shipping_country_code: shippingAddress.countryCode,
        notes: notes || null,
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Failed to create order:', orderError)
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.type === 'product' ? item.id : null,
      gift_box_id: item.type === 'gift_box' ? item.id : null,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Failed to create order items:', itemsError)
      // Clean up order
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      )
    }

    // Build PayHere config
    const nameParts = shippingAddress.name.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || firstName

    const itemsDescription = items
      .map((i) => `${i.name} x${i.quantity}`)
      .join(', ')
      .slice(0, 255)

    const payhereConfig = buildPayhereConfig({
      orderId: order.order_number,
      amount: total,
      firstName,
      lastName,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
      address: shippingAddress.addressLine1,
      city: shippingAddress.city,
      country: shippingAddress.country,
      items: itemsDescription,
    })

    // Send confirmation email (non-blocking)
    const orderWithItems = { ...order, order_items: orderItems as any[] }
    sendOrderConfirmation(orderWithItems, shippingAddress.email).catch((err) => {
      console.error('Failed to send order confirmation email:', err)
    })

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.order_number,
      payhereConfig,
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
